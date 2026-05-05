import db from '../config/db.js';
export { db };

export const createUser = (name, email, password, role = 'user') => {
  const info = db.prepare(
    'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)'
  ).run(name, email, password, role);
  return info.lastInsertRowid;
};

export const getUserByEmail = (email) => {
  return db.prepare('SELECT * FROM users WHERE email = ?').get(email);
};

export const getUserById = (id) => {
  return db.prepare('SELECT * FROM users WHERE id = ?').get(id);
};

export const initUserTable = () => {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT DEFAULT 'user',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
};
