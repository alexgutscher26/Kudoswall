import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { getPusherServer } from "@/lib/pusher-server";
import { db } from "@/lib/server-db";
import { workspaceMember } from "@my-better-t-app/db/schema";
import { and, eq, isNull } from "drizzle-orm";

export async function POST(req: Request) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return new Response("Unauthorized", { status: 401 });
  }

  const body = await req.formData();
  const socketId = body.get("socket_id") as string;
  const channel = body.get("channel_name") as string;

  // Expected channel format: private-inbox:workspaceId
  const workspaceId = channel.replace("private-inbox:", "");

  if (!workspaceId) {
    return new Response("Invalid channel", { status: 400 });
  }

  // Verify membership
  const membership = await db.query.workspaceMember.findFirst({
    where: and(
      eq(workspaceMember.workspaceId, workspaceId),
      eq(workspaceMember.userId, session.user.id),
      isNull(workspaceMember.deletedAt)
    ),
  });

  if (!membership) {
    return new Response("Forbidden", { status: 403 });
  }

  const pusher = await getPusherServer();
  if (!pusher) {
    return new Response("Pusher not configured", { status: 500 });
  }

  const authResponse = pusher.authenticate(socketId, channel);
  return NextResponse.json(authResponse);
}
