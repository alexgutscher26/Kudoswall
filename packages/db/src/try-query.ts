import pg from "pg";
import dotenv from "dotenv";
import path from "path";

// Load env from the dashboard .env file
dotenv.config({ path: path.resolve("../../apps/web/.env") });

async function tryQuery() {
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
    const token = "bxxhsyasbClZJCcVenKYAVLjWcWDtSRV";
    console.log(`Trying query for token: ${token}...`);
    const q = `select "id", "expires_at", "token", "created_at", "updated_at", "ip_address", "user_agent", "user_id" from "session" where "session"."token" = $1`;
    const res = await pool.query(q, [token]);
    console.log("SUCCESS! Rows found:", res.rowCount);
    console.log(res.rows);
  } catch (err: any) {
    console.error("❌ QUERY FAILED!");
    console.error("Error Message:", err.message);
    if (err.detail) console.error("Detail:", err.detail);
    if (err.hint) console.error("Hint:", err.hint);
  } finally {
    await pool.end();
  }
}

tryQuery();
