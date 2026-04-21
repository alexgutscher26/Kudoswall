import { createDb } from "@my-better-t-app/db";
import { sql } from "drizzle-orm";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/**
 * Database health check endpoint.
 * Returns 200 OK if the database is reachable and responsive.
 * Returns 503 Service Unavailable if the connection fails.
 */
export async function GET() {
  const start = Date.now();
  const db = createDb();

  try {
    // Basic ping query to ensure connectivity and responsiveness
    // We use a simple select 1 to minimize overhead
    await db.execute(sql`SELECT 1`);
    
    const latency = Date.now() - start;

    return NextResponse.json({
      status: "ok",
      database: "healthy",
      latency: `${latency}ms`,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Database health check failed:", error);

    return NextResponse.json(
      {
        status: "error",
        database: "unhealthy",
        error: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 503 }
    );
  }
}
