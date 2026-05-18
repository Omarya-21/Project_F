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
  const dbPath = path.resolve(__dirname, '../../backend/database/nexus_v6.db');
  
  // Ensure database directory exists synchronously
  const dir = path.dirname(dbPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  
  const sqlite = new SQLite(dbPath);
  
  // Helper to init from schema.sql
  const initFromFile = () => {
    try {
      const schemaPath = path.resolve(__dirname, '../../backend/schema.sql');
      if (fs.existsSync(schemaPath)) {
        const schema = fs.readFileSync(schemaPath, 'utf8');
        // Use exec for the whole schema block - it's more reliable for multiple statements
        sqlite.exec(schema);
        console.log('✅ Database schema initialized from schema.sql');
      } else {
        console.error('⚠️ schema.sql not found at:', schemaPath);
      }
    } catch (err) {
      console.error('❌ Failed to initialize schema from file:', err.message);
    }
  };

  initFromFile();

  // Wrapper to match mysql2 promise API
  pool = {
    query: async (sql, params = []) => {
      try {
        // Basic SQL transformation for SQLite compatibility
        let transSql = sql
          .replace(/INT PRIMARY KEY AUTO_INCREMENT/gi, 'INTEGER PRIMARY KEY AUTOINCREMENT')
          .replace(/DATETIME DEFAULT CURRENT_TIMESTAMP/gi, 'DATETIME DEFAULT CURRENT_TIMESTAMP')
          .replace(/DECIMAL\(10,2\)/gi, 'DECIMAL');

        const stmt = sqlite.prepare(transSql);
        
        // Ensure params is an array
        const queryParams = Array.isArray(params) ? params : [params];

        const isSelect = transSql.trim().match(/^(SELECT|PRAGMA|SHOW|DESCRIBE|WITH|EXPLAIN)/i);

        if (isSelect) {
          const rows = stmt.all(...queryParams);
          return [rows];
        } else {
          const result = stmt.run(...queryParams);
          return [{ insertId: result.lastInsertRowid, affectedRows: result.changes }];
        }
      } catch (err) {
        console.error('❌ SQLite Query Error:', err.message);
        console.error('SQL:', sql);
        throw err;
      }
    }
  };
}

export default pool;
export { isSQLite };
