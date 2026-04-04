import { Pool } from "pg";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve("../../apps/web/.env") });

async function check() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });

  try {
    console.log("Checking DB connection and schema...");
    const tables = await pool.query(
      `SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'`,
    );
    console.log("Tables in DB:", tables.rows.map((r) => r.table_name).join(", "));

    const columns = await pool.query(
      `SELECT column_name FROM information_schema.columns WHERE table_name = 'session'`,
    );
    console.log("Columns in 'session' table:", columns.rows.map((r) => r.column_name).join(", "));

    // Verify verification table columns too
    const vcols = await pool.query(
      `SELECT column_name FROM information_schema.columns WHERE table_name = 'verification'`,
    );
    console.log(
      "Columns in 'verification' table:",
      vcols.rows.map((r) => r.column_name).join(", "),
    );
  } catch (err) {
    console.error("DEBUG ERROR:", (err as any).message);
    if ((err as any).detail) console.log("DETAIL:", (err as any).detail);
  } finally {
    await pool.end();
  }
}

check();
