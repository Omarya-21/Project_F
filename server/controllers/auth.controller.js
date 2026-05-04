import bcrypt from 'bcryptjs';
import { get, run } from '../database.js';
import { generateToken } from '../middleware/auth.middleware.js';

export const register = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const existingUser = await get('SELECT * FROM users WHERE email = ?', [email]);
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    await run(
      'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
      [name, email, hashedPassword, 'customer']
    );

    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await get('SELECT * FROM users WHERE email = ?', [email]);
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = generateToken(user);
    res.json({
      token,
      user: { id: user.user_id, name: user.name, email: user.email, role: user.role }
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getProfile = async (req, res) => {
  try {
    const user = await get('SELECT user_id, name, email, role FROM users WHERE user_id = ?', [req.user.id]);
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
