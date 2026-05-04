import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import dotenv from 'dotenv';
import { initDb } from './src/database.js';

import fs from 'fs';

// Load env vars
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = process.env.PORT || 3000;

  // Initialize Database
  await initDb();

  // Basic Middlewares
  app.use(cors({
    origin: process.env.FRONTEND_URL || '*',
    credentials: true
  }));
  app.use(express.json());
  app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

  // Import Routes
  const { authRoutes } = await import('./src/routes/auth.routes.js');
  const { productRoutes } = await import('./src/routes/product.routes.js');
  const { cartRoutes } = await import('./src/routes/cart.routes.js');
  const { orderRoutes } = await import('./src/routes/order.routes.js');
  const { adminRoutes } = await import('./src/routes/admin.routes.js');

  // API Routes
  app.use('/api/auth', authRoutes);
  app.use('/api/products', productRoutes);
  app.use('/api/cart', cartRoutes);
  app.use('/api/orders', orderRoutes);
  app.use('/api/admin', adminRoutes);

  // Health Check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Serve static frontend if in same project (fallback)
  const distPath = path.join(__dirname, 'dist');
  if (fs.existsSync(distPath)) {
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 API Server running on port ${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
