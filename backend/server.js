import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import backendApp from './app.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
// Force 5000 in dev, use system PORT (or 3000) in production
const isDev = process.env.NODE_ENV !== 'production';
const PORT = isDev ? 5000 : (process.env.PORT || 3000);

console.log('🔍 ENVIRONMENT DIAGNOSTICS:');
console.log('process.env.NODE_ENV:', process.env.NODE_ENV);
console.log('process.env.npm_lifecycle_event:', process.env.npm_lifecycle_event);
console.log('process.env.PORT:', process.env.PORT);
console.log('isDev judged as:', isDev);
console.log('PORT selected as:', PORT);

// Middleware
app.use(cors());
app.use(express.json());

// Mount backend API routes
app.use(backendApp);

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  const distPath = path.join(__dirname, '../dist');
  app.use(express.static(distPath));
  
  app.get('*', (req, res) => {
    // Only serve index.html for non-API routes
    if (!req.path.startsWith('/api')) {
      res.sendFile(path.join(distPath, 'index.html'));
    }
  });
}

import * as ProductModel from './models/productModel.js';
// Health check
app.get('/health', async (req, res) => {
  let dbStatus = 'unknown';
  let productCount = 0;
  try {
    const products = await ProductModel.getAllProducts();
    dbStatus = 'connected';
    productCount = products.length;
  } catch (e) {
    dbStatus = 'error: ' + e.message;
  }
  res.json({ 
    status: 'ok', 
    service: 'nexus-backend', 
    env: process.env.NODE_ENV,
    db: dbStatus,
    productCount
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Backend API running on port ${PORT}`);
});
