import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import pg from "pg";
import dotenv from "dotenv";
import { resolve } from "path";

dotenv.config({ path: "../../apps/web/.env" });

async function main() {
  const { Pool } = pg;
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false,
    },
  });

  const db = drizzle(pool);

  console.log("Running migrations...");

  try {
    await migrate(db, {
      migrationsFolder: resolve(__dirname, "../src/migrations"),
    });
    console.log("Migrations applied successfully!");
  } catch (error) {
    console.error("Migration failed:", error);
  } finally {
    await pool.end();
  }
}

main();
