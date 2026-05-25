import mysql from 'mysql2/promise';
import SQLite from 'better-sqlite3';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const getSchemaPath = () => {
  const paths = [
    path.resolve(__dirname, '../schema.sql'),
    path.resolve(__dirname, '../../backend/schema.sql'),
    path.resolve(process.cwd(), 'backend/schema.sql'),
    path.resolve(process.cwd(), 'schema.sql'),
    path.resolve(__dirname, 'schema.sql'),
    path.resolve(__dirname, 'backend/schema.sql'),
    '/app/backend/schema.sql',
    '/app/schema.sql'
  ];
  for (const p of paths) {
    if (fs.existsSync(p)) {
      return p;
    }
  }
  return null;
};

let pool;
let isSQLite = false;

// Attempt to connect to MySQL
const connectMySQL = async () => {
  const host = process.env.DB_HOST || process.env.MYSQLHOST;
  const user = process.env.DB_USER || process.env.MYSQLUSER;
  const password = process.env.DB_PASSWORD || process.env.MYSQLPASSWORD || '';
  const database = process.env.DB_NAME || process.env.MYSQLDATABASE;
  const port = parseInt(process.env.DB_PORT || process.env.MYSQLPORT || '3306', 10);
  const connectionString = process.env.DATABASE_URL || process.env.MYSQL_URL || process.env.MYSQL_PRIVATE_URL;

  if (host || connectionString) {
    try {
      let connectionConfig = {
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
        connectTimeout: 10000 // 10s connection timeout
      };

      if (connectionString && (connectionString.startsWith('mysql:') || connectionString.startsWith('mysql2:'))) {
        console.log(`🔌 Attempting to connect to MySQL using connection URI...`);
        connectionConfig.uri = connectionString;
      } else {
        console.log(`🔌 Attempting to connect to MySQL...`);
        console.log(`📡 Host: ${host || 'not specified'}`);
        console.log(`📡 User: ${user || 'not specified'}`);
        console.log(`📡 Database: ${database || 'not specified'}`);
        console.log(`📡 Port: ${port}`);
        
        connectionConfig.host = host;
        connectionConfig.user = user;
        connectionConfig.password = password;
        connectionConfig.database = database;
        connectionConfig.port = port;
      }

      // Automatically enable SSL for cloud-hosted environments (non-localhost)
      const isLocal = 
        (host === 'localhost' || host === '127.0.0.1') || 
        (connectionString && (connectionString.includes('localhost') || connectionString.includes('127.0.0.1')));
      
      if (!isLocal) {
        console.log('🔒 Enabling SSL for secure cloud database connection');
        connectionConfig.ssl = {
          rejectUnauthorized: false
        };
      }

      const mysqlPool = mysql.createPool(connectionConfig);

      // Test the connection
      await mysqlPool.query('SELECT 1');
      console.log('✅ Connected to MySQL database successfully!');

      const schemaPath = getSchemaPath();

      if (schemaPath) {
        console.log(`📜 Found schema.sql at: ${schemaPath}. Initializing MySQL tables...`);
        const schema = fs.readFileSync(schemaPath, 'utf8');
        
        // Clean SQL comment lines first to ensure clean statement execution
        const cleanSchema = schema
          .split('\n')
          .filter(line => !line.trim().startsWith('--'))
          .join('\n');

        const statements = cleanSchema
          .split(';')
          .map(s => s.trim())
          .filter(s => s.length > 0);
        
        for (const statement of statements) {
          try {
            await mysqlPool.query(statement);
          } catch (stmtErr) {
            const isAlreadyExists = 
              stmtErr.message.toLowerCase().includes('already exists') || 
              stmtErr.code === 'ER_TABLE_EXISTS_ERROR' ||
              stmtErr.code === 'ER_DUP_KEYNAME';
              
            if (!isAlreadyExists) {
              console.warn(`⚠️ SQL Statement Warning [Code: ${stmtErr.code || 'none'}]:`, stmtErr.message);
            }
          }
        }
        console.log('✅ MySQL schema check completes successfully');
      } else {
        console.error('⚠️ Could not find schema.sql to initialize MySQL tables!');
      }

      return mysqlPool;
    } catch (err) {
      console.error('❌ MySQL connection failed:', err.message);
      console.log('📦 Falling back to SQLite...');
    }
  } else {
    console.log('ℹ️ No MySQL environment variables detected. Falling back to SQLite...');
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
      const schemaPath = getSchemaPath();
      console.log(`🔍 Checking for schema at: ${schemaPath || 'None'}`);
      if (schemaPath) {
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
