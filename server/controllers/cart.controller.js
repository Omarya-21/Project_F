import { run, query } from '../database.js';

export const getCart = async (req, res) => {
  try {
    const items = await query(`
      SELECT ci.*, p.name, p.price, p.image_url, p.stock, c.name as category_name
      FROM cart_items ci
      JOIN products p ON ci.product_id = p.product_id
      JOIN categories c ON p.category_id = c.category_id
      WHERE ci.user_id = ?
    `, [req.user.id]);
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const addToCart = async (req, res) => {
  const { product_id, quantity } = req.body;
  try {
    const existing = await query('SELECT * FROM cart_items WHERE user_id = ? AND product_id = ?', [req.user.id, product_id]);
    if (existing.length > 0) {
      await run('UPDATE cart_items SET quantity = quantity + ? WHERE cart_item_id = ?', [quantity, existing[0].cart_item_id]);
    } else {
      await run('INSERT INTO cart_items (user_id, product_id, quantity) VALUES (?, ?, ?)', [req.user.id, product_id, quantity]);
    }
    res.json({ message: 'Added to cart' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateCartItem = async (req, res) => {
  const { quantity } = req.body;
  try {
    await run('UPDATE cart_items SET quantity = ? WHERE cart_item_id = ? AND user_id = ?', [quantity, req.params.id, req.user.id]);
    res.json({ message: 'Cart updated' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const removeFromCart = async (req, res) => {
  try {
    await run('DELETE FROM cart_items WHERE cart_item_id = ? AND user_id = ?', [req.params.id, req.user.id]);
    res.json({ message: 'Removed from cart' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
