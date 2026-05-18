import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import * as UserModel from '../models/userModel.js';

const JWT_SECRET = process.env.JWT_SECRET || 'nexus_super_secret_key';

export const register = async (req, res) => {
  const { name, email, password } = req.body;
  
  try {
    const userExists = await UserModel.getUserByEmail(email);
    if (userExists) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const count = await UserModel.getUserCount();
    const role = count === 0 ? 'admin' : 'user';
    
    const userId = await UserModel.createUser(name, email, hashedPassword, role);
    const token = jwt.sign({ id: userId, role }, JWT_SECRET, { expiresIn: '24h' });
    
    res.status(201).json({ 
      token, 
      user: { id: userId, name, email, role } 
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Something went wrong during registration.' });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  
  try {
    const user = await UserModel.getUserByEmail(email);
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign({ id: user.userID, role: user.role }, JWT_SECRET, { expiresIn: '24h' });
    
    res.json({ 
      token, 
      user: { 
        id: user.userID, 
        name: user.name, 
        email: user.email, 
        role: user.role 
      } 
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Something went wrong during login.' });
  }
};

export const getMe = async (req, res) => {
  try {
    const user = await UserModel.getUserById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json({ 
      id: user.userID, 
      name: user.name, 
      email: user.email, 
      role: user.role 
    });
  } catch (error) {
    console.error('getMe error:', error);
    res.status(500).json({ message: 'Could not fetch user data' });
  }
};
