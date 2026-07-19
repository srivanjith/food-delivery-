import rateLimit from 'express-rate-limit';

export const apiLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 10000, // limit each IP to 10000 requests per minute
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again after 1 minute'
  },
  standardHeaders: true,
  legacyHeaders: false
});

export const authLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 5000, // limit each IP to 5000 auth requests per minute
  message: {
    success: false,
    message: 'Too many login or signup attempts, please try again after 1 minute'
  },
  standardHeaders: true,
  legacyHeaders: false
});
