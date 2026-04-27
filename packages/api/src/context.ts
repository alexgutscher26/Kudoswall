import { getDb, createTenantDb } from "@my-better-t-app/db";
import { auth } from "@my-better-t-app/auth";
import type { NextRequest } from "next/server";

export async function createContext(req: NextRequest) {
  // Gracefully handle missing/invalid session — expected in unauthenticated
  // contexts such as the widget embed iframe (no auth cookies sent cross-origin).
  const session = await auth.api.getSession({ headers: req.headers }).catch(() => null);

  const workspaceId = req.headers.get("x-workspace-id");
  const { db, dbRead } = getDb();

  return {
    db,
    dbRead,
    tenantDb: workspaceId ? createTenantDb(db, workspaceId) : null,
    auth: null,
    session,
    req,
  };
}

export type Context = Awaited<ReturnType<typeof createContext>>;
