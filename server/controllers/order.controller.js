import { run, query, get } from '../database.js';

export const createOrder = async (req, res) => {
  const { total_price, shipping_address, items } = req.body;
  const user_id = req.user.id;

  try {
    const orderResult = await run(
      'INSERT INTO orders (user_id, total_price, shipping_address) VALUES (?, ?, ?)',
      [user_id, total_price, shipping_address]
    );
    const order_id = orderResult.lastID;

    for (const item of items) {
      await run(
        'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)',
        [order_id, item.product_id, item.quantity, item.price]
      );
      // Update stock
      await run('UPDATE products SET stock = stock - ? WHERE product_id = ?', [item.quantity, item.product_id]);
    }

    // Clear cart if any
    await run('DELETE FROM cart_items WHERE user_id = ?', [user_id]);

    res.status(201).json({ message: 'Order placed successfully', order_id });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getUserOrders = async (req, res) => {
  try {
    const orders = await query('SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC', [req.user.id]);
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getOrderDetails = async (req, res) => {
    try {
        const order = await get('SELECT * FROM orders WHERE order_id = ?', [req.params.id]);
        if (!order) return res.status(404).json({ message: 'Order not found' });
        
        // Security check
        if (order.user_id !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        const items = await query(`
            SELECT oi.*, p.name, p.image_url 
            FROM order_items oi 
            JOIN products p ON oi.product_id = p.product_id 
            WHERE oi.order_id = ?
        `, [req.params.id]);
        
        res.json({ ...order, items });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
}

export const getAllOrders = async (req, res) => {
    try {
        const orders = await query(`
            SELECT o.*, u.name as user_name 
            FROM orders o 
            JOIN users u ON o.user_id = u.user_id 
            ORDER BY o.created_at DESC
        `);
        res.json(orders);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
}

export const updateOrderStatus = async (req, res) => {
    const { status } = req.body;
    try {
        await run('UPDATE orders SET status = ? WHERE order_id = ?', [status, req.params.id]);
        res.json({ message: 'Order status updated' });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
}
