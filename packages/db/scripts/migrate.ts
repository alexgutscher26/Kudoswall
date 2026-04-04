import { drizzle } from "drizzle-orm/node-postgres";
import { sql } from "drizzle-orm";
import pg from "pg";
import dotenv from "dotenv";

dotenv.config({ path: "../../apps/web/.env" });

const { Pool } = pg;
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const db = drizzle(pool);

async function migrate() {
  console.log("Running manual migration...");

  try {
    // Add workspace columns
    await db.execute(
      sql`ALTER TABLE "workspace" ADD COLUMN IF NOT EXISTS "is_pro" boolean DEFAULT false NOT NULL;`,
    );
    await db.execute(sql`ALTER TABLE "workspace" ADD COLUMN IF NOT EXISTS "branding_json" text;`);
    console.log("✓ Workspace columns synced.");

    // Add project columns
    await db.execute(sql`ALTER TABLE "project" ADD COLUMN IF NOT EXISTS "collection_slug" text;`);
    await db.execute(sql`ALTER TABLE "project" ADD COLUMN IF NOT EXISTS "thank_you_message" text;`);

    // Add unique index for collection_slug
    // We use a try-catch for the index specifically as it might exist
    try {
      await db.execute(
        sql`CREATE UNIQUE INDEX IF NOT EXISTS "project_collection_slug_unique" ON "project" ("collection_slug");`,
      );
      console.log("✓ Project index synced.");
    } catch (e) {}

    console.log("✓ Project columns synced.");
    console.log("Migration complete!");
  } catch (err) {
    console.error("Migration failed:", err);
  } finally {
    await pool.end();
  }
}

migrate();
