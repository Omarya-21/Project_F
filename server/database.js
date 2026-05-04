import sqlite3 from 'sqlite3';
import { promisify } from 'util';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, 'nexus_pc.db');
const db = new sqlite3.Database(dbPath);

export const query = promisify(db.all).bind(db);
export const get = promisify(db.get).bind(db);

export const run = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) reject(err);
      else resolve({ lastID: this.lastID, changes: this.changes });
    });
  });
};

export async function initDb() {
  const uploadsDir = path.join(process.cwd(), 'uploads');
  if (!fs.existsSync(uploadsDir)){
      fs.mkdirSync(uploadsDir);
  }

  await run(`CREATE TABLE IF NOT EXISTS users (
    user_id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT DEFAULT 'customer'
  )`);

  await run(`CREATE TABLE IF NOT EXISTS brands (
    brand_id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL
  )`);

  await run(`CREATE TABLE IF NOT EXISTS categories (
    category_id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL
  )`);

  await run(`CREATE TABLE IF NOT EXISTS products (
    product_id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    price REAL NOT NULL,
    stock INTEGER NOT NULL,
    description TEXT,
    image_url TEXT,
    brand_id INTEGER,
    category_id INTEGER,
    FOREIGN KEY (brand_id) REFERENCES brands (brand_id),
    FOREIGN KEY (category_id) REFERENCES categories (category_id)
  )`);

  await run(`CREATE TABLE IF NOT EXISTS product_specs (
    spec_id INTEGER PRIMARY KEY AUTOINCREMENT,
    product_id INTEGER,
    key TEXT NOT NULL,
    value TEXT NOT NULL,
    FOREIGN KEY (product_id) REFERENCES products (product_id)
  )`);

  await run(`CREATE TABLE IF NOT EXISTS order_items (
    order_item_id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id INTEGER,
    product_id INTEGER,
    quantity INTEGER,
    price REAL NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders (order_id),
    FOREIGN KEY (product_id) REFERENCES products (product_id)
  )`);

  await run(`CREATE TABLE IF NOT EXISTS orders (
    order_id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    total_price REAL NOT NULL,
    status TEXT DEFAULT 'pending',
    shipping_address TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (user_id)
  )`);

  await run(`CREATE TABLE IF NOT EXISTS cart_items (
    cart_item_id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    product_id INTEGER,
    quantity INTEGER,
    FOREIGN KEY (user_id) REFERENCES users (user_id),
    FOREIGN KEY (product_id) REFERENCES products (product_id)
  )`);

  const userCount = await get('SELECT COUNT(*) as count FROM users');
  if (userCount.count === 0) {
    const adminPass = '$2a$10$8.6p6G8P5E6./8G6./8G6.Lz7F7m9Z3S1Q6X2R5W4y/7v9z8Y8zL'; 
    await run(`INSERT INTO users (name, email, password, role) VALUES ('Admin', 'admin@nexuspc.com', '${adminPass}', 'admin')`);
    
    const categories = ['CPU', 'GPU', 'RAM', 'Motherboard', 'Storage', 'PSU', 'Case'];
    for (const cat of categories) {
      await run(`INSERT INTO categories (name) VALUES (?)`, [cat]);
    }

    const brands = ['Intel', 'AMD', 'NVIDIA', 'ASUS', 'MSI', 'Corsair', 'Samsung', 'EVGA'];
    for (const b of brands) {
      await run(`INSERT INTO brands (name) VALUES (?)`, [b]);
    }

    // Seed some products
    const cpu1 = await run(`INSERT INTO products (name, price, stock, description, image_url, brand_id, category_id) 
      VALUES ('Intel Core i9-13900K', 589.99, 15, 'High-end gaming CPU', 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea', 1, 1)`);
    await run(`INSERT INTO product_specs (product_id, key, value) VALUES (?, 'Socket', 'LGA1700')`, [cpu1.lastID]);
  }
}

export { db };
