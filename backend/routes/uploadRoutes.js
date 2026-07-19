import express from 'express';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import path from 'path';
import fs from 'fs';

const router = express.Router();

// Initialize memory storage for processing raw files
const storage = multer.memoryStorage();
const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB max
});

// Configure Cloudinary if credentials exist in the environment
let isCloudinaryConfigured = false;
if (
  process.env.CLOUDINARY_CLOUD_NAME && 
  process.env.CLOUDINARY_API_KEY && 
  process.env.CLOUDINARY_API_SECRET
) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  });
  isCloudinaryConfigured = true;
  console.log('📸 [UPLOAD SERVICE] Cloudinary storage initialized successfully.');
} else if (process.env.CLOUDINARY_URL) {
  isCloudinaryConfigured = true;
  console.log('📸 [UPLOAD SERVICE] Cloudinary storage initialized via URL.');
}

router.post('/', upload.single('image'), async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded in the request' });
    }

    if (isCloudinaryConfigured) {
      console.log('📸 [UPLOAD SERVICE] Uploading image buffer to Cloudinary...');
      
      const uploadStream = () => {
        return new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: 'ecoeats' },
            (error, result) => {
              if (error) return reject(error);
              resolve(result);
            }
          );
          stream.end(req.file.buffer);
        });
      };

      const result = await uploadStream();
      console.log(`📸 [UPLOAD SERVICE] Cloudinary upload successful: ${result.secure_url}`);
      return res.json({
        success: true,
        url: result.secure_url,
        publicId: result.public_id,
        isSimulated: false
      });
    }

    // Fallback: Save files locally on disk
    console.log('📸 [UPLOAD SERVICE] Cloudinary credentials missing. Saving file to local disk...');
    
    const uploadsDir = path.join(process.cwd(), 'uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(req.file.originalname) || '.jpg';
    const filename = `upload-${uniqueSuffix}${ext}`;
    const filePath = path.join(uploadsDir, filename);

    await fs.promises.writeFile(filePath, req.file.buffer);
    
    const localUrl = `http://localhost:5000/uploads/${filename}`;
    console.log(`📸 [UPLOAD SERVICE] Saved file locally: ${filePath}. Access URL: ${localUrl}`);

    res.json({
      success: true,
      url: localUrl,
      isSimulated: true
    });
  } catch (error) {
    console.error('🚨 [UPLOAD SERVICE] Upload error handler caught error:', error.message);
    res.status(500).json({ success: false, message: 'Image upload failed', error: error.message });
  }
});

export default router;
