import pg from "pg";
import dotenv from "dotenv";
const { Client } = pg;

dotenv.config({ path: "../../apps/web/.env" });

const client = new Client({
  connectionString: process.env.DATABASE_URL,
});

async function apply() {
  await client.connect();
  try {
    console.log("Adding unique constraint to project.custom_domain...");
    await client.query(`
      ALTER TABLE project 
      ADD CONSTRAINT project_custom_domain_unique UNIQUE (custom_domain);
    `);
    console.log("Success!");
  } catch (err) {
    console.error("Failed to apply constraint:", err);
  } finally {
    await client.end();
  }
}

apply().catch(console.error);
