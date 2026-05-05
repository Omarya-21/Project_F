import SQLite from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.resolve(__dirname, './backend/database/nexus.db');
const db = new SQLite(dbPath);

const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();
console.log('Tables:', tables);

tables.forEach(t => {
  try {
    const columns = db.prepare(`PRAGMA table_info(${t.name})`).all();
    console.log(`Columns for ${t.name}:`, columns.map(c => c.name));
  } catch (e) {
    console.log(`Error reading columns for ${t.name}:`, e.message);
  }
});
