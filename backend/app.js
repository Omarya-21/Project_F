import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import productRoutes from './routes/productRoutes.js';
import authRoutes from './routes/authRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import { initDb } from './models/productModel.js';
import { initUserTable } from './models/userModel.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

// Set up static files for uploads
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
app.use('/api/uploads', express.static(uploadsDir));

// Initialize DB tables
initDb()
  .then(() => console.log('✅ Products table ready'))
  .catch(err => console.error('❌ Products table error:', err));

initUserTable()
  .then(() => console.log('✅ Users table ready'))
  .catch(err => console.error('❌ Users table error:', err));

// API Routes
app.use('/api/products', productRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/upload', uploadRoutes);

export default app;
