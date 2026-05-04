import { run, query, get } from '../database.js';

export const getStats = async (req, res) => {
  try {
    const totalSales = await get('SELECT SUM(total_price) as total FROM orders WHERE status != "cancelled"');
    const orderCount = await get('SELECT COUNT(*) as count FROM orders');
    const productCount = await get('SELECT COUNT(*) as count FROM products');
    const userCount = await get('SELECT COUNT(*) as count FROM users');
    
    const salesByDay = await query(`
      SELECT date(created_at) as date, SUM(total_price) as sales 
      FROM orders 
      WHERE status != "cancelled" 
      GROUP BY date(created_at) 
      ORDER BY date ASC LIMIT 7
    `);

    const topProducts = await query(`
      SELECT p.name, SUM(oi.quantity) as sold 
      FROM order_items oi 
      JOIN products p ON oi.product_id = p.product_id 
      GROUP BY p.product_id 
      ORDER BY sold DESC LIMIT 5
    `);

    res.json({
      stats: {
        totalSales: totalSales.total || 0,
        orderCount: orderCount.count,
        productCount: productCount.count,
        userCount: userCount.count
      },
      salesByDay,
      topProducts
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const upsertProduct = async (req, res) => {
  const { product_id, name, price, stock, description, image_url, brand_id, category_id, specs } = req.body;
  try {
    if (product_id) {
      await run(`UPDATE products SET name=?, price=?, stock=?, description=?, image_url=?, brand_id=?, category_id=? 
                  WHERE product_id=?`, [name, price, stock, description, image_url, brand_id, category_id, product_id]);
      await run('DELETE FROM product_specs WHERE product_id = ?', [product_id]);
    } else {
      await run(`INSERT INTO products (name, price, stock, description, image_url, brand_id, category_id) 
                                 VALUES (?, ?, ?, ?, ?, ?, ?)`, [name, price, stock, description, image_url, brand_id, category_id]);
    }
    
    res.json({ message: product_id ? 'Product updated' : 'Product created' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteProduct = async (req, res) => {
    try {
        await run('DELETE FROM products WHERE product_id = ?', [req.params.id]);
        await run('DELETE FROM product_specs WHERE product_id = ?', [req.params.id]);
        res.json({ message: 'Product deleted' });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
}

export const getAllUsers = async (req, res) => {
    try {
        const users = await query('SELECT user_id, name, email, role FROM users');
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
}
