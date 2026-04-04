import { Pool } from "pg";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve("../../apps/web/.env") });

async function check() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });

  console.log("Checking session table...");
  try {
    const res = await pool.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'session'
    `);
    console.log("Columns of 'session' table:");
    console.table(res.rows);

    const tables = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);
    console.log("Tables in 'public' schema:");
    console.log(res.rows.map((r) => r.table_name));
  } catch (err) {
    console.error("Error checking schema:", err);
  } finally {
    await pool.end();
    process.exit(0);
  }
}

check();
