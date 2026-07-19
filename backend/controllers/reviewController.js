import Review from '../../db/models/Review.js';

export const getReviews = async (req, res, next) => {
  const { restaurantId } = req.query;
  try {
    const query = restaurantId ? { restaurantId } : {};
    const reviews = await Review.find(query).sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    next(error);
  }
};

export const createReview = async (req, res, next) => {
  try {
    const reviewId = `rev-${Date.now()}`;
    const newReview = new Review({
      ...req.body,
      id: reviewId,
      date: new Date().toISOString().split('T')[0]
    });
    await newReview.save();
    res.status(201).json({ success: true, review: newReview });
  } catch (error) {
    next(error);
  }
};
