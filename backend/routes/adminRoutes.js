import express from 'express';
import { 
  getSystemSettings, 
  updateSystemSettings, 
  getAnalyticsReport,
  getCoupons,
  createCoupon,
  deleteCoupon,
  toggleUserStatus
} from '../controllers/adminController.js';
import { requireAdmin, requireAuth } from '../middleware/authMiddleware.js';
import { validateBody } from '../middleware/validateMiddleware.js';

const router = express.Router();

router.get('/settings', requireAdmin, getSystemSettings);
router.put('/settings', requireAdmin, updateSystemSettings);
router.get('/analytics', requireAdmin, getAnalyticsReport);

// Coupons routing
router.get('/coupons', requireAuth, getCoupons);
router.post('/coupons', requireAdmin, validateBody(['code', 'discountType', 'discountValue']), createCoupon);
router.delete('/coupons/:id', requireAdmin, deleteCoupon);

// User status toggle
router.put('/users/:id/status', requireAdmin, validateBody(['active']), toggleUserStatus);

export default router;
