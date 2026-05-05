import db from '../config/db.js';

export const getAllProducts = () => {
  return db.prepare('SELECT * FROM products').all();
};

export const getProductById = (id) => {
  return db.prepare('SELECT * FROM products WHERE id = ?').get(id);
};

export const createProduct = (name, price, stock, category, image, specs) => {
  const info = db.prepare(
    'INSERT INTO products (name, price, stock, category, image, specs) VALUES (?, ?, ?, ?, ?, ?)'
  ).run(name, price, stock, category, image, specs);
  return info.lastInsertRowid;
};

export const initDb = () => {
  db.exec(`
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      price REAL NOT NULL,
      stock INTEGER NOT NULL,
      category TEXT,
      image TEXT,
      specs TEXT -- JSON string containing technical specifications
    )
  `);

  // Seed data if table is empty
  const count = db.prepare('SELECT COUNT(*) as count FROM products').get().count;
  if (count === 0) {
    const seedProducts = [
      {
        name: 'Intel Core i9-13900K',
        price: 589.99,
        stock: 15,
        category: 'CPU',
        image: 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?q=80&w=300&h=300&fit=crop',
        specs: JSON.stringify({ socket: 'LGA1700', cores: 24, threads: 32, tdp: '125W', ram_type: 'DDR5/DDR4' })
      },
      {
        name: 'AMD Ryzen 9 7950X',
        price: 699.99,
        stock: 10,
        category: 'CPU',
        image: 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?q=80&w=300&h=300&fit=crop',
        specs: JSON.stringify({ socket: 'AM5', cores: 16, threads: 32, tdp: '170W', ram_type: 'DDR5' })
      },
      {
        name: 'ASUS ROG Maximus Z790 Hero',
        price: 629.99,
        stock: 8,
        category: 'Motherboard',
        image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=300&h=300&fit=crop',
        specs: JSON.stringify({ socket: 'LGA1700', form_factor: 'ATX', ram_slots: 4, ram_type: 'DDR5' })
      },
      {
        name: 'MSI MAG X670E TOMAHAWK WIFI',
        price: 339.99,
        stock: 12,
        category: 'Motherboard',
        image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=300&h=300&fit=crop',
        specs: JSON.stringify({ socket: 'AM5', form_factor: 'ATX', ram_slots: 4, ram_type: 'DDR5' })
      },
      {
        name: 'Corsair Vengeance RGB 32GB DDR5-6000',
        price: 159.99,
        stock: 25,
        category: 'RAM',
        image: 'https://images.unsplash.com/photo-1562976540-1502c2145186?q=80&w=300&h=300&fit=crop',
        specs: JSON.stringify({ type: 'DDR5', capacity: '32GB', speed: '6000MT/s' })
      },
      {
        name: 'NVIDIA GeForce RTX 4090',
        price: 1599.99,
        stock: 5,
        category: 'GPU',
        image: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?q=80&w=300&h=300&fit=crop',
        specs: JSON.stringify({ length: '304mm', power_req: '850W', vram: '24GB' })
      },
      {
        name: 'EVGA SuperNOVA 1000 G7',
        price: 199.99,
        stock: 20,
        category: 'PSU',
        image: 'https://images.unsplash.com/photo-1591488320449-011701bb6704?q=80&w=300&h=300&fit=crop',
        specs: JSON.stringify({ wattage: '1000W', efficiency: '80+ Gold' })
      }
    ];

    const insert = db.prepare('INSERT INTO products (name, price, stock, category, image, specs) VALUES (?, ?, ?, ?, ?, ?)');
    seedProducts.forEach(p => insert.run(p.name, p.price, p.stock, p.category, p.image, p.specs));
  }
};
