import { env } from "@my-better-t-app/env/server";
import { drizzle } from "drizzle-orm/neon-serverless";
import { Pool } from "@neondatabase/serverless";

/**
 * A lightweight database client for Edge functions.
 * Excludes the full relational schema to reduce bundle size.
 * Use this when you only need raw Drizzle queries (select, insert, update)
 * and don't need the relational `db.query` API.
 */
export function createLiteDb() {
  const pool = new Pool({
    connectionString: env.DATABASE_URL,
  });

  return drizzle({ client: pool });
}

export const dbLite = createLiteDb();
