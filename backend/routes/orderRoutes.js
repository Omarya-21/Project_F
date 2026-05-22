import express from 'express';
import { createOrder, getMyOrders, getAllOrders, updateOrderStatus, getStats, cancelOrder } from '../controllers/orderController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public stats accessible without login
router.get('/stats', getStats);

// All other order endpoints require user to be logged in
router.use(protect);

router.post('/', createOrder);
router.get('/my', getMyOrders);
router.put('/:orderID/cancel', cancelOrder);
router.get('/', admin, getAllOrders);
router.put('/:orderID/status', admin, updateOrderStatus);

export default router;
