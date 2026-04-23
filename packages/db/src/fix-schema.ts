import pg from "pg";
import dotenv from "dotenv";
import path from "path";

// Load env from the dashboard .env file
dotenv.config({ path: path.resolve("../../apps/web/.env") });

async function fix() {
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
    console.log("Checking for missing workspace_id columns...");

    // Project table
    await pool.query(`ALTER TABLE "project" ADD COLUMN IF NOT EXISTS "workspace_id" text;`);
    console.log("✓ project.workspace_id checked.");

    // Testimonial table
    await pool.query(`ALTER TABLE "testimonial" ADD COLUMN IF NOT EXISTS "workspace_id" text;`);
    console.log("✓ testimonial.workspace_id checked.");

    // Tag table
    await pool.query(`ALTER TABLE "tag" ADD COLUMN IF NOT EXISTS "workspace_id" text;`);
    console.log("✓ tag.workspace_id checked.");

    // Widget table
    await pool.query(`ALTER TABLE "widget" ADD COLUMN IF NOT EXISTS "workspace_id" text;`);
    console.log("✓ widget.workspace_id checked.");

    // Analytics Event table
    await pool.query(`ALTER TABLE "analytics_event" ADD COLUMN IF NOT EXISTS "workspace_id" text;`);
    console.log("✓ analytics_event.workspace_id checked.");

    // Update missing workspace_ids if possible (backfill from relations)
    console.log("Attempting to backfill workspace_ids...");
    
    // Testimonial from Project
    await pool.query(`
      UPDATE "testimonial" t
      SET workspace_id = p.workspace_id
      FROM "project" p
      WHERE t.project_id = p.id AND t.workspace_id IS NULL AND p.workspace_id IS NOT NULL
    `);
    
    // Project from Workspace (if there's only one workspace or we can find an owner)
    // This is harder without a direct link, but we can assume the first workspace for now if needed.
    // Or just let the user fix it in the UI.

    // Constraints (optional but recommended)
    // await pool.query(`ALTER TABLE "testimonial" ALTER COLUMN "workspace_id" SET NOT NULL;`);
    // Wait, don't set NOT NULL yet if we have existing data without workspace_id.

    console.log("🎉 Database schema columns added successfully!");
  } catch (err: any) {
    console.error("❌ MIGRATION FAILED:");
    console.error("Error Message:", err.message);
    if (err.detail) console.error("Detail:", err.detail);
    if (err.hint) console.error("Hint:", err.hint);
  } finally {
    await pool.end();
  }
}

fix();
