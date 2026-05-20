import express from 'express';
import { register, login, getMe, getUsers, updateRole } from '../controllers/authController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);

// Admin-only user management
router.get('/users', protect, admin, getUsers);
router.put('/users/:id/role', protect, admin, updateRole);

export default router;
