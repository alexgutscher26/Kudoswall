import { env } from "@my-better-t-app/env/server";
import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";

import * as schema from "./schema";

const { Pool, types } = pg;

// Set up pg to parse dates correctly to avoid Drizzle mapping errors with better-auth
// TIMESTAMPTZ: 1184, TIMESTAMP: 1114
types.setTypeParser(1114, (val) => new Date(val + "Z"));
types.setTypeParser(1184, (val) => new Date(val));

/**
 * Singleton database connection for serverless/dev resilience.
 */
export let db: ReturnType<typeof drizzle<typeof schema>> | undefined;

export function createDb() {
  if (db) return db;

  const pool = new Pool({
    connectionString: env.DATABASE_URL,
    max: 10, // Increased from 1 to prevent connection deadlocks in Next.js Parallel queries
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 10000, // 10s timeout for cold starts
    idleTimeoutMillis: 10000,
  });

  db = drizzle({ client: pool, schema });
  return db;
}
