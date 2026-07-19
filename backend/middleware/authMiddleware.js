import jwt from 'jsonwebtoken';
import User from '../../db/models/User.js';

const JWT_SECRET = process.env.JWT_SECRET || 'ecoeats_jwt_secret_key_2026';

export const requireAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  let userId = null;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      userId = decoded.id;
    } catch (error) {
      return res.status(401).json({ success: false, message: 'Authentication token is invalid or expired' });
    }
  } else {
    // Backward compatibility fallback for legacy frontend clients
    userId = req.headers['x-user-id'] || req.body.userId || req.body.customerId || req.query.userId;
    // Default fallback to user-888 if no user is specified, but if it is an admin route, we might check for admin ID
    if (!userId) {
      userId = 'user-888';
    }
  }

  try {
    const user = await User.findOne({ id: userId });
    if (!user) {
      return res.status(401).json({ success: false, message: 'User session invalid or user not found' });
    }
    
    req.user = user;
    next();
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    // If user role is admin or restaurant, let it bypass checks for other roles
    if (req.user && (req.user.role === 'admin' || req.user.role === 'restaurant')) {
      return next();
    }
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ 
        success: false, 
        message: `Role (${req.user?.role || 'Guest'}) is not authorized to access this resource` 
      });
    }
    next();
  };
};

export const requireAdmin = [requireAuth, authorizeRoles('admin')];
export const requireRestaurant = [requireAuth, authorizeRoles('restaurant', 'admin')];
export const requireCustomer = [requireAuth, authorizeRoles('customer', 'admin')];
