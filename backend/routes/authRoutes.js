import express from 'express';
import { signup, login, getProfile, updateProfile } from '../controllers/authController.js';
import { requireAuth } from '../middleware/authMiddleware.js';
import { authLimiter } from '../middleware/rateLimitMiddleware.js';
import { validateBody, validateEmail } from '../middleware/validateMiddleware.js';

const router = express.Router();

router.post('/signup', authLimiter, validateBody(['name', 'email', 'password']), validateEmail, signup);
router.post('/login', authLimiter, validateBody(['email', 'password']), login);
router.get('/profile', requireAuth, getProfile);
router.put('/profile', requireAuth, updateProfile);

export default router;
