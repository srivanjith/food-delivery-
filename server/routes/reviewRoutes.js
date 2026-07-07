import express from 'express';
import { getReviews, createReview } from '../controllers/reviewController.js';
import { requireAuth } from '../middleware/authMiddleware.js';
import { validateBody } from '../middleware/validateMiddleware.js';

const router = express.Router();

router.get('/', getReviews);
router.post('/', requireAuth, validateBody(['restaurantId', 'rating', 'comment']), createReview);

export default router;
