import { createDb } from "./index";
import { session } from "./schema/auth";
import { eq } from "drizzle-orm";
import dotenv from "dotenv";
import path from "path";

// Load env from the dashboard .env file
dotenv.config({ path: path.resolve("../../apps/web/.env") });

async function tryDrizzleQuery() {
  const db = createDb();
  const token = "bxxhsyasbClZJCcVenKYAVLjWcWDtSRV";

  try {
    console.log(`Trying Drizzle query for token: ${token}...`);
    const res = await db.select().from(session).where(eq(session.token, token)).limit(1);
    console.log("SUCCESS! Row:", res[0] || "No row found");
  } catch (err: unknown) {
    console.error("❌ DRIZZLE QUERY FAILED!");
    const error = err as Record<string, any>;
    console.error("Error Message:", error.message || String(err));
    if (error.detail) console.error("Detail:", error.detail);
    if (error.hint) console.error("Hint:", error.hint);
    if (error.cause) console.error("Cause:", error.cause.message);
  } finally {
    // pg.Pool.end() is not reachable easily this way, but it works
  }
}

tryDrizzleQuery();
