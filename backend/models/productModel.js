import db from '../config/db.js';

export const getAllProducts = async () => {
  try {
    const [rows] = await db.query(`
      SELECT p.productID as id, p.name, p.price, p.stock, p.description, p.image_url as image,
             b.brand_name as brand, c.category_name as category
      FROM Products p
      LEFT JOIN Brands b ON p.brandID = b.brandID
      LEFT JOIN Category c ON p.categoryID = c.categoryID
    `);
    
    if (!rows) return [];

    // Fetch all specs in one go to be efficient
    const [specRows] = await db.query('SELECT productID, spec_key, value FROM ProductSpecs');
    const specsMap = {};
    specRows.forEach(s => {
      if (!specsMap[s.productID]) specsMap[s.productID] = {};
      specsMap[s.productID][s.spec_key] = s.value;
    });

    const products = rows.map(p => ({
      ...p,
      specs: JSON.stringify(specsMap[p.id] || {})
    }));

    console.log(`✅ Fetched ${products.length} products with specs`);
    return products;
  } catch (err) {
    console.error('❌ Error in getAllProducts:', err.message);
    console.error('Stack:', err.stack);
    throw err;
  }
};

export const getProductById = async (id) => {
  const [rows] = await db.query(`
    SELECT p.productID as id, p.name, p.price, p.stock, p.description, p.image_url as image,
           b.brand_name as brand, c.category_name as category
    FROM Products p
    LEFT JOIN Brands b ON p.brandID = b.brandID
    LEFT JOIN Category c ON p.categoryID = c.categoryID
    WHERE p.productID = ?
  `, [id]);
  
  if (rows[0]) {
    const [specRows] = await db.query('SELECT spec_key, value FROM ProductSpecs WHERE productID = ?', [id]);
    const specs = {};
    specRows.forEach(s => { specs[s.spec_key] = s.value; });
    rows[0].specs = JSON.stringify(specs);
  }
  
  return rows[0];
};

export const createProduct = async (name, brand, price, stock, category, image, description) => {
  // Ensure Brand exists
  let [brandRows] = await db.query('SELECT brandID FROM Brands WHERE brand_name = ?', [brand]);
  let brandID;
  if (brandRows.length === 0) {
    const [res] = await db.query('INSERT INTO Brands (brand_name) VALUES (?)', [brand]);
    brandID = res.insertId;
  } else {
    brandID = brandRows[0].brandID;
  }

  // Ensure Category exists
  let [catRows] = await db.query('SELECT categoryID FROM Category WHERE category_name = ?', [category]);
  let categoryID;
  if (catRows.length === 0) {
    const [res] = await db.query('INSERT INTO Category (category_name) VALUES (?)', [category]);
    categoryID = res.insertId;
  } else {
    categoryID = catRows[0].categoryID;
  }

  const [result] = await db.query(
    'INSERT INTO Products (name, price, stock, description, image_url, brandID, categoryID) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [name, price, stock, description, image, brandID, categoryID]
  );
  return result.insertId;
};

export const initDb = async () => {
  // Seed data if table is empty
  const [rows] = await db.query('SELECT COUNT(*) as count FROM Products');
  if (rows[0].count === 0) {
    const seedProducts = [
      // CPU
      { name: 'Core i9-14900K', brand: 'Intel', price: 589.00, stock: 10, category: 'CPU', image: 'https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&q=80&w=600&h=600', specs: { socket: 'LGA1700', cores: '24', clock: '6.0GHz' } },
      { name: 'Ryzen 9 7950X3D', brand: 'AMD', price: 699.00, stock: 5, category: 'CPU', image: 'https://images.unsplash.com/photo-1555617766-c94804975da3?auto=format&fit=crop&q=80&w=600&h=600', specs: { socket: 'AM5', cores: '16', cache: '128MB' } },
      { name: 'Core i7-14700K', brand: 'Intel', price: 409.00, stock: 15, category: 'CPU', image: 'https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&q=80&w=600&h=600', specs: { socket: 'LGA1700', cores: '20' } },
      { name: 'Ryzen 7 7800X3D', brand: 'AMD', price: 399.00, stock: 20, category: 'CPU', image: 'https://images.unsplash.com/photo-1555617766-c94804975da3?auto=format&fit=crop&q=80&w=600&h=600', specs: { socket: 'AM5', cores: '8' } },
      
      // GPU
      { name: 'RTX 4090 Founders Edition', brand: 'NVIDIA', price: 1599.99, stock: 2, category: 'GPU', image: 'https://images.unsplash.com/photo-1591405351990-4726e331f141?auto=format&fit=crop&q=80&w=600&h=600', specs: { vram: '24GB', type: 'GDDR6X' } },
      { name: 'ROG Strix RTX 4080 Super', brand: 'ASUS', price: 1249.99, stock: 5, category: 'GPU', image: 'https://images.unsplash.com/photo-1588600101460-b635f7959082?auto=format&fit=crop&q=80&w=600&h=600', specs: { vram: '16GB', type: 'GDDR6X' } },
      { name: 'Radeon RX 7900 XTX', brand: 'AMD', price: 949.99, stock: 8, category: 'GPU', image: 'https://images.unsplash.com/photo-1591405351990-4726e331f141?auto=format&fit=crop&q=80&w=600&h=600', specs: { vram: '24GB', type: 'GDDR6' } },
      { name: 'RTX 4070 Ti Super', brand: 'NVIDIA', price: 799.00, stock: 12, category: 'GPU', image: 'https://images.unsplash.com/photo-1588600101460-b635f7959082?auto=format&fit=crop&q=80&w=600&h=600', specs: { vram: '16GB', type: 'GDDR6X' } },

      // Motherboards
      { name: 'ROG Maximus Z790 Hero', brand: 'ASUS', price: 629.99, stock: 6, category: 'Motherboards', image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=600&h=600', specs: { chipset: 'Z790', socket: 'LGA1700' } },
      { name: 'X670E Taichi', brand: 'ASRock', price: 499.00, stock: 4, category: 'Motherboards', image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=600&h=600', specs: { chipset: 'X670E', socket: 'AM5' } },
      
      // Ram
      { name: 'Vengeance RGB 32GB DDR5', brand: 'Corsair', price: 159.99, stock: 25, category: 'Ram', image: 'https://images.unsplash.com/photo-1562976540-1502c2145186?auto=format&fit=crop&q=80&w=600&h=600', specs: { speed: '6000MT/s', capacity: '32GB' } },
      { name: 'Trident Z5 Neo 32GB', brand: 'G.Skill', price: 124.99, stock: 20, category: 'Ram', image: 'https://images.unsplash.com/photo-1599666060175-e7d452d27658?auto=format&fit=crop&q=80&w=600&h=600', specs: { speed: '6000MT/s', capacity: '32GB' } },
      { name: 'Dominator Titanium 64GB', brand: 'Corsair', price: 329.99, stock: 10, category: 'Ram', image: 'https://images.unsplash.com/photo-1562976540-1502c2145186?auto=format&fit=crop&q=80&w=600&h=600', specs: { speed: '6600MT/s', capacity: '64GB' } },

      // Rom
      { name: '990 PRO 2TB', brand: 'Samsung', price: 189.99, stock: 30, category: 'Rom', image: 'https://images.unsplash.com/photo-1597852074816-d933c4d2b988?auto=format&fit=crop&q=80&w=600&h=600', specs: { type: 'NVMe Gen4', capacity: '2TB' } },
      { name: 'WD_BLACK SN850X 2TB', brand: 'Western Digital', price: 164.99, stock: 15, category: 'Rom', image: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&q=80&w=600&h=600', specs: { type: 'NVMe Gen4', capacity: '2TB' } },
      { name: 'Crucial T705 2TB', brand: 'Crucial', price: 299.99, stock: 5, category: 'Rom', image: 'https://images.unsplash.com/photo-1597852074816-d933c4d2b988?auto=format&fit=crop&q=80&w=600&h=600', specs: { type: 'NVMe Gen5', capacity: '2TB' } },

      // PSU
      { name: 'RM850x 850W', brand: 'Corsair', price: 129.99, stock: 12, category: 'PSU', image: 'https://images.unsplash.com/photo-1631284562080-60f9ee06f32e?auto=format&fit=crop&q=80&w=600&h=600', specs: { wattage: '850W', rating: '80+ Gold' } },
      { name: 'HX1200i 1200W', brand: 'Corsair', price: 249.99, stock: 5, category: 'PSU', image: 'https://images.unsplash.com/photo-1631284562080-60f9ee06f32e?auto=format&fit=crop&q=80&w=600&h=600', specs: { wattage: '1200W', rating: '80+ Platinum' } },
      { name: 'MSI MAG A850GL', brand: 'MSI', price: 109.00, stock: 20, category: 'PSU', image: 'https://images.unsplash.com/photo-1631284562080-60f9ee06f32e?auto=format&fit=crop&q=80&w=600&h=600', specs: { wattage: '850W', rating: '80+ Gold' } },

      // Cooling
      { name: 'iCUE H150i ELITE CAPELLIX', brand: 'Corsair', price: 199.99, stock: 15, category: 'Cooling', image: 'https://images.unsplash.com/photo-1588600101460-b635f7959082?auto=format&fit=crop&q=80&w=600&h=600', specs: { type: '360mm AIO', rgb: 'Yes' } },
      { name: 'NH-D15 chromax.black', brand: 'Noctua', price: 119.95, stock: 10, category: 'Cooling', image: 'https://images.unsplash.com/photo-1555617766-c94804975da3?auto=format&fit=crop&q=80&w=600&h=600', specs: { type: 'Air Cooler', socket: 'Multi' } },

      // Cases
      { name: 'O11 Dynamic EVO', brand: 'Lian Li', price: 169.99, stock: 10, category: 'cases', image: 'https://images.unsplash.com/photo-1624705002806-5d72df19c3ad?auto=format&fit=crop&q=80&w=600&h=600', specs: { type: 'Mid Tower', side_panel: 'Tempered Glass' } },
      { name: 'H9 Flow', brand: 'NZXT', price: 159.99, stock: 8, category: 'cases', image: 'https://images.unsplash.com/photo-1624705002806-5d72df19c3ad?auto=format&fit=crop&q=80&w=600&h=600', specs: { type: 'Dual Chamber', color: 'White' } },
      { name: 'North XL', brand: 'Fractal Design', price: 189.00, stock: 4, category: 'cases', image: 'https://images.unsplash.com/photo-1624705002806-5d72df19c3ad?auto=format&fit=crop&q=80&w=600&h=600', specs: { type: 'Full Tower', accent: 'Wood' } },

      // Peripherals
      { name: 'G Pro X Superlight 2', brand: 'Logitech', price: 159.00, stock: 20, category: 'mouses', image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&q=80&w=600&h=600', specs: { weight: '60g', sensor: 'HERO 2' } },
      { name: 'DeathAdder V3 Pro', brand: 'Razer', price: 149.99, stock: 15, category: 'mouses', image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&q=80&w=600&h=600', specs: { weight: '63g', sensor: 'Optical' } },
      { name: 'Apex Pro TKL', brand: 'SteelSeries', price: 189.99, stock: 15, category: 'keyboards', image: 'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?auto=format&fit=crop&q=80&w=600&h=600', specs: { switches: 'OmniPoint', layout: 'TKL' } },
      { name: 'Keychron Q1 Max', brand: 'Keychron', price: 219.00, stock: 6, category: 'keyboards', image: 'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?auto=format&fit=crop&q=80&w=600&h=600', specs: { switches: 'Gateron Jupiter', hotswap: 'Yes' } },
      { name: 'TITAN Evo 2022', brand: 'Secretlab', price: 549.00, stock: 5, category: 'gaming-chairs', image: 'https://images.unsplash.com/photo-1592078615290-033ee584e267?auto=format&fit=crop&q=80&w=600&h=600', specs: { material: 'Leatherette', size: 'Regular' } },

      // Monitors
      { name: 'UltraGear 27GR95QE-B', brand: 'LG', price: 899.99, stock: 8, category: 'Monitors', image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&q=80&w=600&h=600', specs: { panel: 'OLED', refresh_rate: '240Hz' } },
      { name: 'Odyssey Neo G9', brand: 'Samsung', price: 1799.99, stock: 3, category: 'Monitors', image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&q=80&w=600&h=600', specs: { size: '49 inch', panel: 'Mini-LED' } }
    ];

    for (const p of seedProducts) {
      const productId = await createProduct(p.name, p.brand, p.price, p.stock, p.category, p.image, `${p.brand} ${p.name} - High quality PC component.`);
      // Add specs
      for (const [key, value] of Object.entries(p.specs)) {
        await db.query('INSERT INTO ProductSpecs (productID, spec_key, value) VALUES (?, ?, ?)', [productId, key, String(value)]);
      }
    }
  }
};
