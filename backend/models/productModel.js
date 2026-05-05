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
      id INT PRIMARY KEY AUTO_INCREMENT,
      name VARCHAR(255) NOT NULL,
      brand VARCHAR(100) NOT NULL,
      price DECIMAL(10,2) NOT NULL,
      stock INT NOT NULL,
      category VARCHAR(100),
      image TEXT,
      specs TEXT
    )
  `);

  // Seed data if table is empty
  const [rows] = await db.query('SELECT COUNT(*) as count FROM products');
  if (rows[0].count === 0) {
    const seedProducts = [
      // CPU
      { name: 'Core i9-14900K', brand: 'Intel', price: 589.00, stock: 10, category: 'CPU', image: 'https://images.unsplash.com/photo-1591488320449-011701bb6704?q=80&w=300&h=300&fit=crop', specs: JSON.stringify({ socket: 'LGA1700', cores: 24 }) },
      { name: 'Ryzen 9 7950X3D', brand: 'AMD', price: 699.00, stock: 5, category: 'CPU', image: 'https://images.unsplash.com/photo-1591488320449-011701bb6704?q=80&w=300&h=300&fit=crop', specs: JSON.stringify({ socket: 'AM5', cores: 16 }) },
      // GPU
      { name: 'RTX 4090 Founders Edition', brand: 'NVIDIA', price: 1599.99, stock: 2, category: 'GPU', image: 'https://images.unsplash.com/photo-1591405351990-4726e331f141?q=80&w=300&h=300&fit=crop', specs: JSON.stringify({ vram: '24GB' }) },
      { name: 'ROG Strix RTX 4080 Super', brand: 'ASUS', price: 1249.99, stock: 5, category: 'GPU', image: 'https://images.unsplash.com/photo-1591405351990-4726e331f141?q=80&w=300&h=300&fit=crop', specs: JSON.stringify({ vram: '16GB' }) },
      // Ram
      { name: 'Vengeance RGB 32GB DDR5', brand: 'Corsair', price: 159.99, stock: 25, category: 'Ram', image: 'https://images.unsplash.com/photo-1562976540-1502c2145186?q=80&w=300&h=300&fit=crop', specs: JSON.stringify({ speed: '6000MT/s' }) },
      { name: 'Trident Z5 Neo 32GB', brand: 'G.Skill', price: 124.99, stock: 20, category: 'Ram', image: 'https://images.unsplash.com/photo-1562976540-1502c2145186?q=80&w=300&h=300&fit=crop', specs: JSON.stringify({ speed: '6000MT/s' }) },
      // Rom
      { name: '990 PRO 2TB', brand: 'Samsung', price: 189.99, stock: 30, category: 'Rom', image: 'https://images.unsplash.com/photo-1544006659-f0b21f04cb1d?q=80&w=300&h=300&fit=crop', specs: JSON.stringify({ type: 'NVMe' }) },
      { name: 'WD_BLACK SN850X 2TB', brand: 'Western Digital', price: 164.99, stock: 15, category: 'Rom', image: 'https://images.unsplash.com/photo-1544006659-f0b21f04cb1d?q=80&w=300&h=300&fit=crop', specs: JSON.stringify({ type: 'NVMe' }) },
      // PSU
      { name: 'RM850x 850W', brand: 'Corsair', price: 129.99, stock: 12, category: 'PSU', image: 'https://images.unsplash.com/photo-1591488320449-011701bb6704?q=80&w=300&h=300&fit=crop', specs: JSON.stringify({ wattage: '850W' }) },
      // Cases
      { name: 'O11 Dynamic EVO', brand: 'Lian Li', price: 169.99, stock: 10, category: 'cases', image: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?q=80&w=300&h=300&fit=crop', specs: JSON.stringify({ type: 'Mid Tower' }) },
      // Peripherals
      { name: 'G Pro X Superlight 2', brand: 'Logitech', price: 159.00, stock: 20, category: 'mouses', image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?q=80&w=300&h=300&fit=crop', specs: JSON.stringify({ weight: '60g' }) },
      { name: 'Apex Pro TKL', brand: 'SteelSeries', price: 189.99, stock: 15, category: 'keyboards', image: 'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?q=80&w=300&h=300&fit=crop', specs: JSON.stringify({ switches: 'OmniPoint' }) },
      { name: 'TITAN Evo 2022', brand: 'Secretlab', price: 549.00, stock: 5, category: 'gaming-chairs', image: 'https://images.unsplash.com/photo-1598550476439-6847785fce6k?q=80&w=300&h=300&fit=crop', specs: JSON.stringify({ material: 'Leatherette' }) }
    ];

    for (const p of seedProducts) {
      await db.query('INSERT INTO products (name, brand, price, stock, category, image, specs) VALUES (?, ?, ?, ?, ?, ?, ?)', 
      [p.name, p.brand, p.price, p.stock, p.category, p.image, p.specs]);
    }
  }
};
