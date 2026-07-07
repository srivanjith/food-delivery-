import express from 'express';
import { requestSettlement, getSettlements, approveSettlement } from '../controllers/settlementController.js';
import { requireAuth, requireRestaurant, requireAdmin } from '../middleware/authMiddleware.js';
import { validateBody } from '../middleware/validateMiddleware.js';

const router = express.Router();

router.post('/request', requireRestaurant, validateBody(['restaurantId', 'amount']), requestSettlement);
router.get('/', requireAuth, getSettlements);
router.put('/:id/approve', requireAdmin, approveSettlement);

export default router;
