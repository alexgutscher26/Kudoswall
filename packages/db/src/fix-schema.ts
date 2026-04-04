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

  console.log("Using DATABASE_URL (prefix):", dbUrl.substring(0, 20) + "...");

  const pool = new pg.Pool({
    connectionString: dbUrl,
    ssl: { rejectUnauthorized: false },
  });

  try {
    console.log("Checking for tables...");
    const tablesRes = await pool.query(
      `SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'`,
    );
    const tableNames = tablesRes.rows.map((r) => r.table_name);
    console.log("Tables found:", tableNames.join(", "));

    if (!tableNames.includes("session")) {
      console.log("⚠️ session table missing. Creating it...");
      await pool.query(`
        CREATE TABLE "session" (
          "id" text PRIMARY KEY NOT NULL,
          "expires_at" timestamp NOT NULL,
          "token" text NOT NULL,
          "created_at" timestamp DEFAULT now() NOT NULL,
          "updated_at" timestamp NOT NULL DEFAULT now(),
          "ip_address" text,
          "user_agent" text,
          "user_id" text NOT NULL,
          CONSTRAINT "session_token_unique" UNIQUE("token")
        );
      `);
      console.log("✓ session table created.");
    } else {
      console.log("✓ session table exists. Adding missing columns...");
      await pool.query(`ALTER TABLE "session" ADD COLUMN IF NOT EXISTS "ip_address" text;`);
      await pool.query(`ALTER TABLE "session" ADD COLUMN IF NOT EXISTS "user_agent" text;`);
    }

    if (!tableNames.includes("verification")) {
      console.log("⚠️ verification table missing. Creating it...");
      await pool.query(`
        CREATE TABLE "verification" (
          "id" text PRIMARY KEY NOT NULL,
          "identifier" text NOT NULL,
          "value" text NOT NULL,
          "expires_at" timestamp NOT NULL,
          "created_at" timestamp DEFAULT now() NOT NULL,
          "updated_at" timestamp DEFAULT now() NOT NULL
        );
      `);
      console.log("✓ verification table created.");
    }

    console.log("🎉 Database schema synchronized successfully!");
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
