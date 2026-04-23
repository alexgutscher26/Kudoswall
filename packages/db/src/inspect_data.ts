import { Pool } from '@neondatabase/serverless';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve('../../apps/web/.env') });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function check() {
  const res = await pool.query(`SELECT id, workspace_id FROM project`);
  console.table(res.rows);
  process.exit(0);
}

check();
