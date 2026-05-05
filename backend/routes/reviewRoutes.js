import express from 'express';
import { addReview, getProductReviews } from '../controllers/reviewController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/:productId', getProductReviews);
router.post('/', authenticateToken, addReview);

export default router;
