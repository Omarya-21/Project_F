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
const connectMySQL = async () => {
  if (process.env.DB_HOST) {
    try {
      console.log(`🔌 Attempting to connect to MySQL at ${process.env.DB_HOST}...`);
      const mysqlPool = mysql.createPool({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
        connectTimeout: 5000 // 5s timeout
      });

      // Test the connection
      await mysqlPool.query('SELECT 1');
      console.log('✅ Connected to MySQL database');

      // Initialize MySQL schema if needed
      const schemaPath = path.resolve(__dirname, '../../backend/schema.sql');
      if (fs.existsSync(schemaPath)) {
        const schema = fs.readFileSync(schemaPath, 'utf8');
        // Simple split and execute for MySQL
        const statements = schema
          .split(';')
          .map(s => s.trim())
          .filter(s => s.length > 0);
        
        for (const statement of statements) {
          try {
            await mysqlPool.query(statement);
          } catch (stmtErr) {
            // Ignore "already exists" errors
            if (!stmtErr.message.includes('already exists') && !stmtErr.message.includes('Table \'.*\' already exists')) {
              console.warn('⚠️ SQL Statement Warning:', stmtErr.message);
            }
          }
        }
        console.log('✅ MySQL schema checked/initialized');
      }

      return mysqlPool;
    } catch (err) {
      console.error('❌ MySQL connection failed:', err.message);
      console.log('📦 Falling back to SQLite...');
    }
  }
  return null;
};

pool = await connectMySQL();

if (!pool) {
  console.log('📦 Using SQLite fallback for data persistence');
  isSQLite = true;
  const dbPath = path.resolve(__dirname, '../database/nexus_v8.db');
  
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
      console.log(`🔍 Checking for schema at: ${schemaPath}`);
      if (fs.existsSync(schemaPath)) {
        let schema = fs.readFileSync(schemaPath, 'utf8');
        console.log(`📜 Read schema file (${schema.length} bytes)`);
        
        // Transform for SQLite compatibility
        const sqliteSchema = schema
          .replace(/INT PRIMARY KEY AUTO_INCREMENT/gi, 'INTEGER PRIMARY KEY AUTOINCREMENT')
          .replace(/INT PRIMARY KEY/gi, 'INTEGER PRIMARY KEY')
          .replace(/DECIMAL\(10,2\)/gi, 'DECIMAL')
          .replace(/AUTO_INCREMENT/gi, 'AUTOINCREMENT');
        
        sqlite.exec(sqliteSchema);
        console.log('✅ Database schema initialized successfully');
      } else {
        console.error('⚠️ schema.sql not found at:', schemaPath);
      }
    } catch (err) {
      console.error('❌ Failed to initialize schema:', err.message);
      console.error('Error stack:', err.stack);
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
