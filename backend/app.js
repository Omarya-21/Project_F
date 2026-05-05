import express from 'express';
import cors from 'cors';
import productRoutes from './routes/productRoutes.js';
import authRoutes from './routes/authRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import { initDb } from './models/productModel.js';
import { initUserTable } from './models/userModel.js';

const app = express();
app.use(cors());
app.use(express.json());

// Initialize DB tables
initDb();
initUserTable();

// API Routes
app.use('/api/products', productRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/ai', aiRoutes);

export default app;
