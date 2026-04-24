import { getDb, createTenantDb } from "@my-better-t-app/db";
import { auth } from "@my-better-t-app/auth";
import type { NextRequest } from "next/server";

export async function createContext(req: NextRequest) {
  const session = await auth.api.getSession({
    headers: req.headers,
  });

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
