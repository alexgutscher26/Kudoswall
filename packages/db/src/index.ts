import { env } from "@my-better-t-app/env/server";
import { drizzle } from "drizzle-orm/neon-serverless";
import { Pool, neonConfig } from "@neondatabase/serverless";
// import ws from "ws"; (removed for edge compatibility)

import * as schema from "./schema";

// Configure Neon to use the ws package only in Node.js environments
if (
  typeof (globalThis as { window?: unknown }).window === "undefined" &&
  process.env.NEXT_RUNTIME !== "edge"
) {
  // @ts-ignore - dynamic require for Node environment
  const ws = require("ws");
  neonConfig.webSocketConstructor = ws;
}

/**
 * Singleton database connection for serverless/dev resilience.
 */
export type Database = ReturnType<typeof drizzle<typeof schema>>;
export let db: Database | undefined;

export function createDb() {
  if (db) return db;

  const pool = new Pool({
    connectionString: env.DATABASE_URL,
  });

  db = drizzle({ client: pool, schema });
  return db;
}

export * from "./audit";
