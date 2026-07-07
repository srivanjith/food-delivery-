import express from 'express';
import { createOrder, getOrders, updateOrderStatus } from '../controllers/orderController.js';
import { requireAuth, requireRestaurant } from '../middleware/authMiddleware.js';
import { validateBody } from '../middleware/validateMiddleware.js';

const router = express.Router();

router.get('/', requireAuth, getOrders);
router.post('/', requireAuth, validateBody(['restaurantId', 'restaurantName', 'items', 'subtotal', 'total']), createOrder);
router.put('/:id/status', requireAuth, validateBody(['status']), updateOrderStatus);

export default router;
