import SQLite from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.resolve(__dirname, './backend/database/nexus_v8.db');
console.log('Opening DB at:', dbPath);
const db = new SQLite(dbPath);

try {
  const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();
  console.log('Tables:', tables.map(t => t.name));

  const productCount = db.prepare("SELECT COUNT(*) as count FROM Products").get();
  console.log('Product Count:', productCount.count);

  if (productCount.count > 0) {
    const sample = db.prepare("SELECT * FROM Products LIMIT 1").get();
    console.log('Sample Product:', sample);
    
    const specs = db.prepare("SELECT * FROM ProductSpecs WHERE productID = ?").all(sample.productID);
    console.log('Specs for sample:', specs);
  } else {
    console.log('No products found. Seeding might have failed or not run yet.');
  }
} catch (e) {
  console.error('Error:', e.message);
}
