import { createAuth } from "@my-better-t-app/auth";
import { createDb } from "@my-better-t-app/db";
import type { NextRequest } from "next/server";

const db = createDb();

export async function createContext(req: NextRequest) {
  const session = await createAuth().api.getSession({
    headers: req.headers,
  });
  return {
    db,
    auth: null,
    session,
  };
}

export type Context = Awaited<ReturnType<typeof createContext>>;
