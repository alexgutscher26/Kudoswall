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
  } catch (err: unknown) {
    console.error("❌ QUERY FAILED!");
    const error = err as Record<string, unknown>;
    console.error("Error Message:", error.message || String(err));
    if (error.detail) console.error("Detail:", error.detail);
    if (error.hint) console.error("Hint:", error.hint);
  } finally {
    await pool.end();
  }
}

tryQuery();
