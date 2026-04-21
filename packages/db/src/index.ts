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
 * Singleton database connections for serverless/dev resilience.
 */
export type Database = ReturnType<typeof drizzle<typeof schema>>;
export let db: Database | undefined;
export let dbRead: Database | undefined;

export function createDb() {
  if (db) return db;

  const pool = new Pool({
    connectionString: env.DATABASE_URL,
  });

  db = drizzle({ client: pool, schema });

  // If a separate read URL is provided, create a separate pool for reads
  if (env.DATABASE_READ_URL) {
    const readPool = new Pool({
      connectionString: env.DATABASE_READ_URL,
    });
    dbRead = drizzle({ client: readPool, schema });
  } else {
    // Fallback to primary for reads if no replica is configured
    dbRead = db;
  }

  return db;
}

/**
 * Helper to get both read and write clients. 
 * Use this in contexts like tRPC where you want to expose both.
 */
export function getDb() {
  const mainDb = createDb();
  return { db: mainDb, dbRead: dbRead! };
}

export * from "./audit";
