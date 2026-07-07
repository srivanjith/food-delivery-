import FoodItem from '../models/FoodItem.js';
import Category from '../models/Category.js';

export const getFoodItems = async (req, res, next) => {
  const { restaurantId, search, organic, vegan } = req.query;
  try {
    const filter = { available: true };
    if (restaurantId) filter.restaurantId = restaurantId;
    if (organic === 'true') filter.organic = true;
    if (vegan === 'true') filter.vegan = true;
    if (search) {
      filter.name = { $regex: search, $options: 'i' };
    }

    const items = await FoodItem.find(filter);
    res.json(items);
  } catch (error) {
    next(error);
  }
};

export const createFoodItem = async (req, res, next) => {
  try {
    const foodId = `food-${Date.now()}`;
    const newItem = new FoodItem({
      ...req.body,
      id: foodId,
      rating: 5.0
    });
    await newItem.save();
    res.status(201).json({ success: true, foodItem: newItem });
  } catch (error) {
    next(error);
  }
};

export const updateFoodItem = async (req, res, next) => {
  const { id } = req.params;
  try {
    const updated = await FoodItem.findOneAndUpdate(
      { id },
      { $set: req.body },
      { new: true }
    );
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Food item not found' });
    }
    res.json({ success: true, foodItem: updated });
  } catch (error) {
    next(error);
  }
};

export const deleteFoodItem = async (req, res, next) => {
  const { id } = req.params;
  try {
    const result = await FoodItem.deleteOne({ id });
    if (result.deletedCount === 0) {
      return res.status(404).json({ success: false, message: 'Food item not found' });
    }
    res.json({ success: true, message: 'Food item deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// Category handlers
export const getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find({ active: true });
    res.json(categories);
  } catch (error) {
    next(error);
  }
};

export const createCategory = async (req, res, next) => {
  const { name, description } = req.body;
  try {
    const exists = await Category.findOne({ name });
    if (exists) {
      return res.status(400).json({ success: false, message: 'Category already exists' });
    }
    const newCategory = await Category.create({ name, description });
    res.status(201).json({ success: true, category: newCategory });
  } catch (error) {
    next(error);
  }
};
