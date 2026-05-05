import db from '../config/db.js';

export const getAllProducts = async () => {
  const [rows] = await db.query('SELECT * FROM products');
  return rows;
};

export const getProductById = async (id) => {
  const [rows] = await db.query('SELECT * FROM products WHERE id = ?', [id]);
  return rows[0];
};

export const createProduct = async (name, brand, price, stock, category, image, specs) => {
  const [result] = await db.query(
    'INSERT INTO products (name, brand, price, stock, category, image, specs) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [name, brand, price, stock, category, image, specs]
  );
  return result.insertId;
};

export const initDb = async () => {
  await db.query(`
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      brand TEXT NOT NULL,
      price REAL NOT NULL,
      stock INTEGER NOT NULL,
      category TEXT,
      image TEXT,
      specs TEXT
    )
  `);

  // Seed data if table is empty
  const [rows] = await db.query('SELECT COUNT(*) as count FROM products');
  if (rows[0].count === 0) {
    const seedProducts = [
      // CPU
      { name: 'Core i9-14900K', brand: 'Intel', price: 589.00, stock: 10, category: 'CPU', image: 'https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&q=80&w=300&h=300', specs: JSON.stringify({ socket: 'LGA1700', cores: 24 }) },
      { name: 'Ryzen 9 7950X3D', brand: 'AMD', price: 699.00, stock: 5, category: 'CPU', image: 'https://images.unsplash.com/photo-1555617766-c94804975da3?auto=format&fit=crop&q=80&w=300&h=300', specs: JSON.stringify({ socket: 'AM5', cores: 16 }) },
      // GPU
      { name: 'RTX 4090 Founders Edition', brand: 'NVIDIA', price: 1599.99, stock: 2, category: 'GPU', image: 'https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&q=80&w=300&h=300', specs: JSON.stringify({ vram: '24GB' }) },
      { name: 'ROG Strix RTX 4080 Super', brand: 'ASUS', price: 1249.99, stock: 5, category: 'GPU', image: 'https://images.unsplash.com/photo-1591405351990-4726e331f141?auto=format&fit=crop&q=80&w=300&h=300', specs: JSON.stringify({ vram: '16GB' }) },
      // Ram
      { name: 'Vengeance RGB 32GB DDR5', brand: 'Corsair', price: 159.99, stock: 25, category: 'Ram', image: 'https://images.unsplash.com/photo-1562976540-1502c2145186?auto=format&fit=crop&q=80&w=300&h=300', specs: JSON.stringify({ speed: '6000MT/s' }) },
      { name: 'Trident Z5 Neo 32GB', brand: 'G.Skill', price: 124.99, stock: 20, category: 'Ram', image: 'https://images.unsplash.com/photo-1562976540-1502c2145186?auto=format&fit=crop&q=80&w=300&h=300', specs: JSON.stringify({ speed: '6000MT/s' }) },
      // Rom
      { name: '990 PRO 2TB', brand: 'Samsung', price: 189.99, stock: 30, category: 'Rom', image: 'https://images.unsplash.com/photo-1597852074816-d933c4d2b988?auto=format&fit=crop&q=80&w=300&h=300', specs: JSON.stringify({ type: 'NVMe' }) },
      { name: 'WD_BLACK SN850X 2TB', brand: 'Western Digital', price: 164.99, stock: 15, category: 'Rom', image: 'https://images.unsplash.com/photo-1597852074816-d933c4d2b988?auto=format&fit=crop&q=80&w=300&h=300', specs: JSON.stringify({ type: 'NVMe' }) },
      // PSU
      { name: 'RM850x 850W', brand: 'Corsair', price: 129.99, stock: 12, category: 'PSU', image: 'https://images.unsplash.com/photo-1631284562080-60f9ee06f32e?auto=format&fit=crop&q=80&w=300&h=300', specs: JSON.stringify({ wattage: '850W' }) },
      // Cases
      { name: 'O11 Dynamic EVO', brand: 'Lian Li', price: 169.99, stock: 10, category: 'cases', image: 'https://images.unsplash.com/photo-1624705002806-5d72df19c3ad?auto=format&fit=crop&q=80&w=300&h=300', specs: JSON.stringify({ type: 'Mid Tower' }) },
      // Peripherals
      { name: 'G Pro X Superlight 2', brand: 'Logitech', price: 159.00, stock: 20, category: 'mouses', image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&q=80&w=300&h=300', specs: JSON.stringify({ weight: '60g' }) },
      { name: 'Apex Pro TKL', brand: 'SteelSeries', price: 189.99, stock: 15, category: 'keyboards', image: 'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?auto=format&fit=crop&q=80&w=300&h=300', specs: JSON.stringify({ switches: 'OmniPoint' }) },
      { name: 'TITAN Evo 2022', brand: 'Secretlab', price: 549.00, stock: 5, category: 'gaming-chairs', image: 'https://images.unsplash.com/photo-1592078615290-033ee584e267?auto=format&fit=crop&q=80&w=300&h=300', specs: JSON.stringify({ material: 'Leatherette' }) }
    ];

    for (const p of seedProducts) {
      // Check if product exists by name to update image if needed, otherwise insert
      const [existing] = await db.query('SELECT id FROM products WHERE name = ?', [p.name]);
      if (existing.length > 0) {
        await db.query('UPDATE products SET image = ? WHERE id = ?', [p.image, existing[0].id]);
      } else {
        await db.query('INSERT INTO products (name, brand, price, stock, category, image, specs) VALUES (?, ?, ?, ?, ?, ?, ?)', 
        [p.name, p.brand, p.price, p.stock, p.category, p.image, p.specs]);
      }
    }
  }
};
