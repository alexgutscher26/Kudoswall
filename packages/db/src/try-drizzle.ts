import { createDb } from "./index";
import { session } from "./schema/auth";
import { eq } from "drizzle-orm";
import dotenv from "dotenv";
import path from "path";

// Load env from the dashboard .env file
dotenv.config({ path: path.resolve("../../apps/web/.env") });

async function tryDrizzleQuery() {
  const db = createDb();
  const token = process.env.SESSION_TOKEN || process.argv[2];

  if (!token) {
    console.error("❌ ERROR: No session token provided. Please provide it via SESSION_TOKEN env variable or as a command-line argument.");
    process.exit(1);
  }

  try {
    console.log(`Trying Drizzle query for token: ${token}...`);
    const res = await db.select().from(session).where(eq(session.token, token)).limit(1);
    console.log("SUCCESS! Row:", res[0] || "No row found");
  } catch (err: any) {
    console.error("❌ DRIZZLE QUERY FAILED!");
    console.error("Error Message:", err.message);
    if (err.detail) console.error("Detail:", err.detail);
    if (err.hint) console.error("Hint:", err.hint);
    if (err.cause) console.error("Cause:", err.cause.message);
  } finally {
    // pg.Pool.end() is not reachable easily this way, but it works
  }
}

tryDrizzleQuery();
