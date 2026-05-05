import mysql from 'mysql2/promise';
import SQLite from 'better-sqlite3';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let pool;
let isSQLite = false;

// Attempt to connect to MySQL
const connectMySQL = () => {
  try {
    // Only try MySQL if explicit DB_HOST is provided and it's not localhost
    if (process.env.DB_HOST && process.env.DB_HOST !== 'localhost') {
      return mysql.createPool({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0
      });
    }
  } catch (err) {
    console.error('MySQL connection omitted or failed, falling back to SQLite');
  }
  return null;
};

pool = connectMySQL();

if (!pool) {
  console.log('📦 Using SQLite fallback for data persistence');
  isSQLite = true;
  const dbPath = path.resolve(__dirname, '../database/omar_pc.db');
  
  // Ensure database directory exists synchronously
  const dir = path.dirname(dbPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  
  const sqlite = new SQLite(dbPath);
  
  // Wrapper to match mysql2 promise API
  pool = {
    query: async (sql, params = []) => {
      // Basic SQL transformation for SQLite compatibility
      let transSql = sql
        .replace(/INT PRIMARY KEY AUTO_INCREMENT/gi, 'INTEGER PRIMARY KEY AUTOINCREMENT')
        .replace(/DATETIME DEFAULT CURRENT_TIMESTAMP/gi, 'DATETIME DEFAULT CURRENT_TIMESTAMP')
        .replace(/DECIMAL\(10,2\)/gi, 'DECIMAL');

      const stmt = sqlite.prepare(transSql);
      
      if (transSql.trim().toUpperCase().startsWith('SELECT')) {
        const rows = stmt.all(...params);
        return [rows];
      } else {
        const result = stmt.run(...params);
        return [{ insertId: result.lastInsertRowid, affectedRows: result.changes }];
      }
    }
  };
}

export default pool;
export { isSQLite };
