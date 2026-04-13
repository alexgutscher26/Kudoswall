import { pgTable, text, timestamp, boolean, uniqueIndex } from "drizzle-orm/pg-core";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import dotenv from "dotenv";

dotenv.config({ path: "../../apps/web/.env" });

const client = postgres(process.env.DATABASE_URL!);
const db = drizzle(client);

async function checkDuplicates() {
  try {
    const results = await db.execute(`
      SELECT custom_domain, COUNT(*) 
      FROM project 
      WHERE custom_domain IS NOT NULL 
      GROUP BY custom_domain 
      HAVING COUNT(*) > 1
    `);

    if (results.length > 0) {
      console.log("Found duplicate domains:", results);
    } else {
      console.log("No duplicate custom domains found.");
    }
  } finally {
    await client.end();
  }
}

checkDuplicates().catch(console.error);
