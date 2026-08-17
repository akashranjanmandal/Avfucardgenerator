import postgres from 'postgres';

let sql = null;
function getSql() {
  if (sql) return sql;

  const connectionString = process.env.DATABASE_URL || process.env.NETLIFY_DATABASE_URL;
  if (!connectionString) {
    throw new Error(
      'No database connection string found. Set DATABASE_URL (e.g. your Supabase connection ' +
        'string) as an environment variable in Netlify, and locally via `netlify dev`.'
    );
  }

  // prepare: false — required for poolers (e.g. Supabase's pgbouncer in transaction
  // mode) that don't support prepared statements across pooled connections.
  sql = postgres(connectionString, { prepare: false, ssl: 'require' });
  return sql;
}

let schemaReady = null;
function ensureSchema() {
  if (!schemaReady) {
    schemaReady = getSql().unsafe(`
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
  return getSql().unsafe(text, params);
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
