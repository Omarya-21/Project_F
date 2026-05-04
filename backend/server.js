import express from 'express';
import cors from 'cors';
import db from './db.js';

const app = express();
app.use(cors());
app.use(express.json());

// API Routes
app.get('/api/products', (req, res) => {
  try {
    const rows = db.prepare('SELECT * FROM products').all();
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Database error' });
  }
});

app.post('/api/products', (req, res) => {
  const { name, price, stock, category } = req.body;
  try {
    const info = db.prepare(
      'INSERT INTO products (name, price, stock, category) VALUES (?, ?, ?, ?)'
    ).run(name, price, stock, category);
    
    res.status(201).json({ 
      id: info.lastInsertRowid, 
      name, 
      price, 
      stock, 
      category 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Database error' });
  }
});

// Initialization (Create table if not exists)
const init = () => {
  try {
    db.exec(`
      CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        price REAL NOT NULL,
        stock INTEGER NOT NULL,
        category TEXT
      )
    `);
    console.log('Database initialized');
  } catch (err) {
    console.error('Initialization error:', err);
  }
};

init();

export default app;
