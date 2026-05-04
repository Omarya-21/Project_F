import db from '../config/db.js';

export const getAllProducts = () => {
  return db.prepare('SELECT * FROM products').all();
};

export const getProductById = (id) => {
  return db.prepare('SELECT * FROM products WHERE id = ?').get(id);
};

export const createProduct = (name, price, stock, category) => {
  const info = db.prepare(
    'INSERT INTO products (name, price, stock, category) VALUES (?, ?, ?, ?)'
  ).run(name, price, stock, category);
  return info.lastInsertRowid;
};

export const initDb = () => {
  db.exec(`
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      price REAL NOT NULL,
      stock INTEGER NOT NULL,
      category TEXT
    )
  `);
};
