import express from 'express';
import { getAllRestaurants, createRestaurant, updateRestaurant, deleteRestaurant } from '../controllers/restaurantController.js';
import { requireAdmin, requireRestaurant } from '../middleware/authMiddleware.js';
import { validateBody } from '../middleware/validateMiddleware.js';

const router = express.Router();

router.get('/', getAllRestaurants);
router.post('/', requireAdmin, validateBody(['name', 'location', 'address']), createRestaurant);
router.put('/:id', requireRestaurant, updateRestaurant);
router.delete('/:id', requireAdmin, deleteRestaurant);

export default router;
