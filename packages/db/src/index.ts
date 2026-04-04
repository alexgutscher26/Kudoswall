import { env } from "@my-better-t-app/env/server";
import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";

import * as schema from "./schema";

const { Pool } = pg;

/**
 * Singleton database connection for serverless/dev resilience.
 */
let db: ReturnType<typeof drizzle<typeof schema>> | undefined;

export function createDb() {
  if (db) return db;

  const pool = new Pool({
    connectionString: env.DATABASE_URL,
    max: 1, // Only 1 connection at a time in lambda environments
    connectionTimeoutMillis: 10000, // 10s timeout for cold starts
    idleTimeoutMillis: 10000,
  });

  db = drizzle({ client: pool, schema });
  return db;
}
