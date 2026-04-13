import pg from "pg";
import dotenv from "dotenv";
const { Client } = pg;

dotenv.config({ path: "../../apps/web/.env" });

const client = new Client({
  connectionString: process.env.DATABASE_URL,
});

async function check() {
  await client.connect();
  try {
    const res = await client.query(`
      SELECT custom_domain, COUNT(*) 
      FROM project 
      WHERE custom_domain IS NOT NULL 
      GROUP BY custom_domain 
      HAVING COUNT(*) > 1
    `);
    if (res.rows.length > 0) {
      console.log("DUPLICATES_FOUND", JSON.stringify(res.rows));
    } else {
      console.log("NO_DUPLICATES");
    }
  } finally {
    await client.end();
  }
}

check().catch(console.error);
