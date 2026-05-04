import { Router } from 'express';
import * as orderController from '../controllers/order.controller.js';
import { verifyToken, isAdmin } from '../middleware/auth.middleware.js';

const router = Router();

router.use(verifyToken);

router.post('/', orderController.createOrder);
router.get('/my-orders', orderController.getUserOrders);
router.get('/all', isAdmin, orderController.getAllOrders);
router.get('/:id', orderController.getOrderDetails);
router.patch('/:id/status', isAdmin, orderController.updateOrderStatus);

export const orderRoutes = router;
