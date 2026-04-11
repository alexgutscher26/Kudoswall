import { env } from "@my-better-t-app/env/server";
import { drizzle } from "drizzle-orm/neon-serverless";
import { Pool, neonConfig } from "@neondatabase/serverless";
import ws from "ws";

import * as schema from "./schema";

// Configure Neon to use the ws package for WebSockets in Node.js
neonConfig.webSocketConstructor = ws;

/**
 * Singleton database connection for serverless/dev resilience.
 */
export let db: ReturnType<typeof drizzle<typeof schema>> | undefined;

export function createDb() {
  if (db) return db;

  const pool = new Pool({
    connectionString: env.DATABASE_URL,
  });

  db = drizzle({ client: pool, schema });
  return db;
}
