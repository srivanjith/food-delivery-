import Restaurant from '../models/Restaurant.js';
import Wallet from '../models/Wallet.js';

export const getAllRestaurants = async (req, res, next) => {
  try {
    const restaurants = await Restaurant.find({ active: true });
    res.json(restaurants);
  } catch (error) {
    next(error);
  }
};

export const createRestaurant = async (req, res, next) => {
  try {
    const restId = `rest-${Date.now()}`;
    const newRest = new Restaurant({
      ...req.body,
      id: restId,
      rating: 5.0,
      distance: parseFloat((Math.random() * 4 + 0.5).toFixed(1))
    });

    await newRest.save();

    // Initialize restaurant wallet
    await Wallet.create({
      holderId: restId,
      holderType: 'restaurant',
      coinBalance: 0,
      fiatBalance: 0
    });

    res.status(201).json({ success: true, restaurant: newRest });
  } catch (error) {
    next(error);
  }
};

export const updateRestaurant = async (req, res, next) => {
  const { id } = req.params;
  try {
    const updated = await Restaurant.findOneAndUpdate(
      { id },
      { $set: req.body },
      { new: true }
    );
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Restaurant not found' });
    }
    res.json({ success: true, restaurant: updated });
  } catch (error) {
    next(error);
  }
};

export const deleteRestaurant = async (req, res, next) => {
  const { id } = req.params;
  try {
    const deleted = await Restaurant.deleteOne({ id });
    if (deleted.deletedCount === 0) {
      return res.status(404).json({ success: false, message: 'Restaurant not found' });
    }
    // Delete associated food items
    await import('../models/FoodItem.js').then(async (m) => {
      const FoodItem = m.default;
      await FoodItem.deleteMany({ restaurantId: id });
    });
    res.json({ success: true, message: 'Restaurant and menu deleted successfully' });
  } catch (error) {
    next(error);
  }
};
