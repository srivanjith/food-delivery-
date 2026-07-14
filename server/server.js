// Server bootstrap setup nodemon reload
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import http from 'http';
import { Server } from 'socket.io';
import path from 'path';

// Middlewares
import { requestLogger } from './middleware/loggerMiddleware.js';
import { errorHandler } from './middleware/errorMiddleware.js';
import { apiLimiter } from './middleware/rateLimitMiddleware.js';

// Route files
import authRoutes from './routes/authRoutes.js';
import restaurantRoutes from './routes/restaurantRoutes.js';
import menuRoutes from './routes/menuRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import rewardRoutes from './routes/rewardRoutes.js';
import settlementRoutes from './routes/settlementRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Create HTTP server for WebSocket integration
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"]
  }
});

// Expose Socket.io instance on express application
app.set('io', io);

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ecoeats')
  .then(() => console.log('Connected to MongoDB successfully'))
  .catch(err => console.error('MongoDB connection error:', err));

// Global Middlewares
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(requestLogger);
app.use('/api', apiLimiter);

// API Routing Mounts
app.use('/api/auth', authRoutes);
app.use('/api/restaurants', restaurantRoutes);
app.use('/api/food-items', menuRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/rewards', rewardRoutes);
app.use('/api/settlements', settlementRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/upload', uploadRoutes);

// Static hosting fallback for local uploaded images
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// Socket.io Connection Event Handlers
io.on('connection', (socket) => {
  console.log(`🔌 [WEBSOCKET] Client connected: ${socket.id}`);
  
  socket.on('join-order-room', (orderId) => {
    socket.join(`order:${orderId}`);
    console.log(`🔌 [WEBSOCKET] Client ${socket.id} joined tracking channel for order: ${orderId}`);
  });

  socket.on('disconnect', () => {
    console.log(`🔌 [WEBSOCKET] Client disconnected: ${socket.id}`);
  });
});

// Welcome and status health check route
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Welcome to the EcoEats API server!',
    status: 'Running',
    database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected',
    timestamp: new Date()
  });
});

// Fallback route
app.use('*', (req, res, next) => {
  const error = new Error(`Resource ${req.originalUrl} not found`);
  error.statusCode = 404;
  next(error);
});

// Centralized error handling middleware
app.use(errorHandler);

server.listen(PORT, () => {
  console.log(`EcoEats backend server is running on http://localhost:${PORT}`);
});

