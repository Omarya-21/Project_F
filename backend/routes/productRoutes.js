import express from 'express';
import { getProducts, addProduct, getProductById, updateProduct } from '../controllers/productController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getProducts);
router.get('/:id', getProductById);
router.post('/', protect, admin, addProduct);
router.put('/:id', protect, admin, updateProduct);

export default router;
