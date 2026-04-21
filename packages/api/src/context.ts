import { getDb } from "@my-better-t-app/db";
import { auth } from "@my-better-t-app/auth";
import type { NextRequest } from "next/server";

const { db, dbRead } = getDb();

export async function createContext(req: NextRequest) {
  const session = await auth.api.getSession({
    headers: req.headers,
  });
  return {
    db,
    dbRead,
    auth: null,
    session,
    req,
  };
}

export type Context = Awaited<ReturnType<typeof createContext>>;
