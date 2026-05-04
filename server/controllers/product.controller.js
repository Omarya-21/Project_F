import { query, get, run } from '../database.js';

export const getAllProducts = async (req, res) => {
  const { category, brand, search, sort } = req.query;
  let sql = `SELECT p.*, c.name as category_name, b.name as brand_name 
            FROM products p 
            JOIN categories c ON p.category_id = c.category_id 
            JOIN brands b ON p.brand_id = b.brand_id WHERE 1=1`;
  const params = [];

  if (category) {
    sql += ' AND c.name = ?';
    params.push(category);
  }
  if (brand) {
    sql += ' AND b.name = ?';
    params.push(brand);
  }
  if (search) {
    sql += ' AND (p.name LIKE ? OR p.description LIKE ?)';
    params.push(`%${search}%`, `%${search}%`);
  }

  if (sort === 'price-low') sql += ' ORDER BY p.price ASC';
  else if (sort === 'price-high') sql += ' ORDER BY p.price DESC';
  else sql += ' ORDER BY p.product_id DESC';

  try {
    const products = await query(sql, params);
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getProductById = async (req, res) => {
  try {
    const product = await get(`SELECT p.*, c.name as category_name, b.name as brand_name 
                              FROM products p 
                              JOIN categories c ON p.category_id = c.category_id 
                              JOIN brands b ON p.brand_id = b.brand_id 
                              WHERE p.product_id = ?`, [req.params.id]);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    const specs = await query('SELECT * FROM product_specs WHERE product_id = ?', [req.params.id]);
    res.json({ ...product, specs });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getCategories = async (req, res) => {
  try {
    const categories = await query('SELECT * FROM categories');
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getBrands = async (req, res) => {
  try {
    const brands = await query('SELECT * FROM brands');
    res.json(brands);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const checkCompatibility = async (req, res) => {
  const { parts } = req.body; 
  try {
    const results = [];
    const cpu = parts.find((p) => p.category_name === 'CPU');
    const mobo = parts.find((p) => p.category_name === 'Motherboard');
    const ram = parts.find((p) => p.category_name === 'RAM');
    const gpu = parts.find((p) => p.category_name === 'GPU');
    const psu = parts.find((p) => p.category_name === 'PSU');

    if (cpu && mobo) {
      const cpuSocket = await get("SELECT value FROM product_specs WHERE product_id = ? AND key = 'Socket'", [cpu.product_id]);
      const moboSocket = await get("SELECT value FROM product_specs WHERE product_id = ? AND key = 'Socket'", [mobo.product_id]);
      if (cpuSocket && moboSocket && cpuSocket.value !== moboSocket.value) {
        results.push({ type: 'error', message: `CPU Socket (${cpuSocket.value}) and Motherboard Socket (${moboSocket.value}) are incompatible!` });
      }
    }

    if (mobo && ram) {
      const moboRam = await get("SELECT value FROM product_specs WHERE product_id = ? AND key = 'RAM Type'", [mobo.product_id]);
      const ramType = await get("SELECT value FROM product_specs WHERE product_id = ? AND key = 'RAM Type'", [ram.product_id]);
       if (moboRam && ramType && moboRam.value !== ramType.value) {
        results.push({ type: 'error', message: `Motherboard supports ${moboRam.value} but RAM is ${ramType.value}!` });
      }
    }

    if (psu && gpu) {
       const gpuWattage = await get("SELECT value FROM product_specs WHERE product_id = ? AND key = 'Min PSU Wattage'", [gpu.product_id]);
       const psuWattage = await get("SELECT value FROM product_specs WHERE product_id = ? AND key = 'Wattage'", [psu.product_id]);
       if (gpuWattage && psuWattage && parseInt(psuWattage.value) < parseInt(gpuWattage.value)) {
         results.push({ type: 'warning', message: `PSU Wattage (${psuWattage.value}W) may be insufficient for this GPU (Recommended: ${gpuWattage.value}W).` });
       }
    }

    res.json({ compatible: results.length === 0, messages: results });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
