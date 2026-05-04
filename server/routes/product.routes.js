import { Router } from 'express';
import * as productController from '../controllers/product.controller.js';

const router = Router();

router.get('/', productController.getAllProducts);
router.get('/categories', productController.getCategories);
router.get('/brands', productController.getBrands);
router.get('/:id', productController.getProductById);
router.post('/check-compatibility', productController.checkCompatibility);

export const productRoutes = router;
