import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import backendApp from './app.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Mount backend API routes
app.use(backendApp);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'nexus-backend' });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Backend API running on http://localhost:${PORT}`);
});
