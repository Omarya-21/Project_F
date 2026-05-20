import db from '../config/db.js';
export { db };

export const createUser = async (name, email, password, role = 'user') => {
  const [result] = await db.query(
    'INSERT INTO Users (name, email, password, role) VALUES (?, ?, ?, ?)',
    [name, email, password, role]
  );
  return result.insertId;
};

export const getUserByEmail = async (email) => {
  const [rows] = await db.query('SELECT * FROM Users WHERE email = ?', [email]);
  return rows[0];
};

export const getUserById = async (id) => {
  const [rows] = await db.query('SELECT * FROM Users WHERE userID = ?', [id]);
  return rows[0];
};

export const getUserCount = async () => {
  const [rows] = await db.query('SELECT COUNT(*) as count FROM Users');
  return rows[0].count;
};

export const getAllUsers = async () => {
  const [rows] = await db.query('SELECT userID, name, email, phone, address, role FROM Users ORDER BY userID DESC');
  return rows;
};

export const updateUserRole = async (userId, role) => {
  await db.query('UPDATE Users SET role = ? WHERE userID = ?', [role, userId]);
};

export const initUserTable = async () => {
  // Schema is now initialized in backend/config/db.js from schema.sql
};
