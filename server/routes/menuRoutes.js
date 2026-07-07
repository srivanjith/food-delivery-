import express from 'express';
import { getFoodItems, createFoodItem, updateFoodItem, deleteFoodItem, getCategories, createCategory } from '../controllers/menuController.js';
import { requireAdmin, requireRestaurant } from '../middleware/authMiddleware.js';
import { validateBody } from '../middleware/validateMiddleware.js';

const router = express.Router();

router.get('/', getFoodItems);
router.post('/', requireRestaurant, validateBody(['restaurantId', 'name', 'price']), createFoodItem);
router.put('/:id', requireRestaurant, updateFoodItem);
router.delete('/:id', requireRestaurant, deleteFoodItem);

// Category routes
router.get('/categories', getCategories);
router.post('/categories', requireAdmin, validateBody(['name']), createCategory);

export default router;
