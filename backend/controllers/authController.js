import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import * as UserModel from '../models/userModel.js';

const JWT_SECRET = process.env.JWT_SECRET || 'nexus_super_secret_key';

export const register = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const existingUser = await UserModel.getUserByEmail(email);
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Check if any users exist
    const [rows] = await UserModel.db.query('SELECT COUNT(*) as count FROM users');
    const userCount = rows[0].count;
    const role = userCount === 0 ? 'admin' : 'user';
    
    const userId = await UserModel.createUser(name, email, hashedPassword, role);
    
    const token = jwt.sign({ id: userId, role }, JWT_SECRET, { expiresIn: '24h' });
    console.log(`✅ User registered successfully: ${email}`);
    res.status(201).json({ token, user: { id: userId, name, email, role } });
  } catch (error) {
    console.error('❌ Registration error:', error);
    res.status(500).json({ message: error.message || 'Registration failed' });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await UserModel.getUserByEmail(email);
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '24h' });
    res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  } catch (error) {
    console.error('❌ Login error:', error);
    res.status(500).json({ message: error.message || 'Login failed' });
  }
};

export const getMe = async (req, res) => {
  try {
    const user = await UserModel.getUserById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ id: user.id, name: user.name, email: user.email, role: user.role });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
