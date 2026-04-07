import pg from "pg";
import dotenv from "dotenv";
import path from "path";

// Load env from the dashboard .env file
dotenv.config({ path: path.resolve("../../apps/web/.env") });

async function checkTables() {
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) {
    console.error("❌ DATABASE_URL not found in environment.");
    process.exit(1);
  }

  const pool = new pg.Pool({
    connectionString: dbUrl,
    ssl: { rejectUnauthorized: false },
  });

  try {
    console.log("Listing tables and columns...");
    const res = await pool.query(
      `SELECT table_name, column_name, data_type FROM information_schema.columns WHERE table_schema = 'public' ORDER BY table_name, column_name`,
    );
    console.log(res.rows);
  } catch (err) {
    console.error(err);
  } finally {
    await pool.end();
  }
}

checkTables();
