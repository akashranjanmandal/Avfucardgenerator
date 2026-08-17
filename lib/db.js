import { neon } from '@neondatabase/serverless';

let sql = null;
function getSql() {
  if (sql) return sql;

  const connectionString = process.env.NETLIFY_DATABASE_URL || process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error(
      'No database connection string found. Run this app via `netlify dev` after `netlify db init` ' +
        'sets NETLIFY_DATABASE_URL, or set DATABASE_URL manually.'
    );
  }

  sql = neon(connectionString);
  return sql;
}

let schemaReady = null;
function ensureSchema() {
  if (!schemaReady) {
    schemaReady = getSql().query(`
      CREATE TABLE IF NOT EXISTS cards (
        id SERIAL PRIMARY KEY,
        id_no TEXT NOT NULL,
        name TEXT NOT NULL,
        designation TEXT,
        office_dept TEXT,
        photo_path TEXT,
        signature_path TEXT,
        home_address TEXT,
        dob TEXT,
        blood_group TEXT,
        mobile TEXT,
        email TEXT,
        identification_mark TEXT,
        date_of_issue TEXT,
        valid_upto TEXT,
        pdf_path TEXT,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      );
    `);
  }
  return schemaReady;
}

async function all(text, params = []) {
  await ensureSchema();
  return getSql().query(text, params);
}

async function get(text, params = []) {
  const rows = await all(text, params);
  return rows[0] || null;
}

async function run(text, params = []) {
  return all(text, params);
}

const db = { all, get, run };

export default db;
