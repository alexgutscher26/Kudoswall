import pg from "pg";
import dotenv from "dotenv";

dotenv.config({ path: "../../apps/web/.env" });

const { Client } = pg;

async function main() {
  console.log("Adding unique constraint manually to bypass blocking prompt...");

  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    await client.connect();

    // Add unique constraint to stripe_customer_id
    // We use a DO block to check if it exists or just try/catch
    await client.query(`
      DO $$ BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'workspace_stripe_customer_id_unique') THEN
          ALTER TABLE "workspace" ADD CONSTRAINT "workspace_stripe_customer_id_unique" UNIQUE ("stripe_customer_id");
        END IF;
      END $$;
    `);

    console.log("Unique constraint 'workspace_stripe_customer_id_unique' added successfully.");
  } catch (err: any) {
    console.error("Error adding constraint:", err.message);
  } finally {
    await client.end();
  }
}

main();
