import { createDb } from "@my-better-t-app/db";
import { sql } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET() {
  const db = createDb();

  try {
    // 1. Inspect ALL tables in ANY schema
    const tables = await db.execute(sql`
      SELECT table_schema, table_name 
      FROM information_schema.tables 
      WHERE table_type = 'BASE TABLE' 
      AND table_schema NOT IN ('information_schema', 'pg_catalog')
    `);

    // 2. Log everything to help diagnose
    const foundTables = tables.rows.map((r: any) => `${r.table_schema}.${r.table_name}`);
    console.log("ALL TABLES FOUND:", foundTables);

    return NextResponse.json({
      success: false,
      message: "Inspection complete. See tables below to confirm if 'session' exists.",
      found_tables: foundTables,
      hint: "If you don't see 'session' here, we need to create it. If you do see it in another schema, we need to point Better Auth to that schema.",
    });
  } catch (error: any) {
    console.error("DB Fix Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        detail: (error as any).detail,
        hint: "Check server logs for more details.",
      },
      { status: 500 },
    );
  }
}
