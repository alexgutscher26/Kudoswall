import pg from "pg";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: "../../apps/web/.env" });

const { Client } = pg;

async function main() {
  console.log("Adding columns manually to bypass TTY error...");

  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    await client.connect();

    // Add user.plan
    await client.query(
      `ALTER TABLE "user" ADD COLUMN IF NOT EXISTS "plan" text DEFAULT 'free' NOT NULL;`,
    );
    console.log("Added user.plan");

    // Create enums if they don't exist
    await client.query(`DO $$ 
      BEGIN 
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'plan') THEN
          CREATE TYPE "plan" AS ENUM('free', 'plan_1', 'plan_2', 'plan_3', 'ltd');
        END IF;
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'subscription_status') THEN
          CREATE TYPE "subscription_status" AS ENUM('active', 'trialing', 'past_due', 'canceled', 'incomplete', 'incomplete_expired', 'paused', 'unpaid');
        END IF;
      END $$;`);
    console.log("Created enums");

    // Add workspace columns
    await client.query(
      `ALTER TABLE "workspace" ADD COLUMN IF NOT EXISTS "plan" "plan" DEFAULT 'free' NOT NULL;`,
    );
    await client.query(
      `ALTER TABLE "workspace" ADD COLUMN IF NOT EXISTS "stripe_customer_id" text;`,
    );
    await client.query(
      `ALTER TABLE "workspace" ADD COLUMN IF NOT EXISTS "stripe_subscription_id" text;`,
    );
    await client.query(
      `ALTER TABLE "workspace" ADD COLUMN IF NOT EXISTS "subscription_status" "subscription_status";`,
    );
    await client.query(
      `ALTER TABLE "workspace" ADD COLUMN IF NOT EXISTS "notification_settings_json" text;`,
    );

    // Drop is_pro if it exists
    await client.query(`ALTER TABLE "workspace" DROP COLUMN IF EXISTS "is_pro";`);
    console.log("Updated workspace table and dropped is_pro");
  } catch (err: any) {
    console.error("Error syncing DB:", err.message);
  } finally {
    await client.end();
  }
}

main();
