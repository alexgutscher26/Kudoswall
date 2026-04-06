import dotenv from "dotenv";
import pg from "pg";

dotenv.config({ path: "../../apps/web/.env" });

const { Pool } = pg;
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function testConnection() {
  console.log("Testing connection with URL: ", process.env.DATABASE_URL?.substring(0, 20) + "...");
  try {
    const res = await pool.query("SELECT 1;");
    console.log("SUCCESS: ", res.rows);
  } catch (err) {
    console.error("FAILURE: ", err);
  } finally {
    await pool.end();
  }
}

testConnection();
