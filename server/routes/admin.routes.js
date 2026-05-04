import { Router } from 'express';
import * as adminController from '../controllers/admin.controller.js';
import { verifyToken, isAdmin } from '../middleware/auth.middleware.js';

const router = Router();

router.use(verifyToken);
router.use(isAdmin);

router.get('/stats', adminController.getStats);
router.post('/products', adminController.upsertProduct);
router.delete('/products/:id', adminController.deleteProduct);
router.get('/users', adminController.getAllUsers);

export const adminRoutes = router;
