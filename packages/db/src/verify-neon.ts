import { createDb } from "./index";
import { workspace } from "./schema/app";
import { eq } from "drizzle-orm";
import dotenv from "dotenv";
import path from "path";

// Load env from the dashboard .env file
dotenv.config({ path: path.resolve("../../apps/web/.env") });

async function verify() {
  console.log("🚀 Verifying Neon connection...");
  const db = createDb();

  try {
    // Try to list workspaces (should be 0 since it's a new DB)
    const result = await db.select().from(workspace).limit(1);
    console.log("✅ Success! Database is reachable.");
    console.log("Workspaces found:", result.length);
  } catch (err: any) {
    console.error("❌ Verification FAILED!");
    console.error(err);
  } finally {
    process.exit();
  }
}

verify();
