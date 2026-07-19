import express from 'express';
import { getAllRestaurants, createRestaurant, updateRestaurant, deleteRestaurant, registerOwnerRestaurant } from '../controllers/restaurantController.js';
import { requireAdmin, requireRestaurant } from '../middleware/authMiddleware.js';
import { validateBody } from '../middleware/validateMiddleware.js';

const router = express.Router();

router.get('/', getAllRestaurants);
router.post('/', requireAdmin, validateBody(['name', 'location', 'address']), createRestaurant);
router.post('/register-owner', requireRestaurant, validateBody(['name', 'location', 'address']), registerOwnerRestaurant);
router.put('/:id', requireRestaurant, updateRestaurant);
router.delete('/:id', requireAdmin, deleteRestaurant);

export default router;
