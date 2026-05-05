import * as ReviewModel from '../models/reviewModel.js';

export const addReview = async (req, res) => {
  const { productID, rating, comment } = req.body;
  const userID = req.user.id;

  if (!productID || !rating) {
    return res.status(400).json({ message: 'Product ID and rating are required' });
  }

  try {
    const reviewID = await ReviewModel.createReview(userID, productID, rating, comment);
    res.status(201).json({ reviewID, message: 'Review added successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getProductReviews = async (req, res) => {
  const { productId } = req.params;

  try {
    const reviews = await ReviewModel.getReviewsByProductId(productId);
    const average = await ReviewModel.getAverageRating(productId);
    res.json({ reviews, average });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
