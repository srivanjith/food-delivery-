import express from 'express';
import { createOrder, getOrders, updateOrderStatus, verifyOrderPayment, getPendingDeliveryOrders, assignCourierToOrder } from '../controllers/orderController.js';
import { requireAuth, requireRestaurant } from '../middleware/authMiddleware.js';
import { validateBody } from '../middleware/validateMiddleware.js';

const router = express.Router();

router.get('/', requireAuth, getOrders);
router.get('/delivery/pending', requireAuth, getPendingDeliveryOrders);
router.put('/:id/assign-courier', requireAuth, assignCourierToOrder);
router.post('/', requireAuth, validateBody(['restaurantId', 'restaurantName', 'items', 'subtotal', 'total']), createOrder);
router.put('/:id/status', requireAuth, validateBody(['status']), updateOrderStatus);
router.post('/:id/verify-payment', requireAuth, verifyOrderPayment);

export default router;
