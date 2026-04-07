import pg from "pg";
import dotenv from "dotenv";
import path from "path";

// Load env from the dashboard .env file
dotenv.config({ path: path.resolve("../../apps/web/.env") });

async function checkNulls() {
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
    console.log("Checking for NULL values in 'session' table...");
    const res = await pool.query(
      `SELECT id, token, created_at, updated_at FROM "session" WHERE updated_at IS NULL OR created_at IS NULL`,
    );
    console.log("Rows with NULLs:", res.rowCount);
    console.log(res.rows);
  } catch (err) {
    console.error(err);
  } finally {
    await pool.end();
  }
}

checkNulls();
