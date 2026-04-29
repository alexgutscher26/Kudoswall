import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { getPusherServer } from "@/lib/pusher-server";
import { db } from "@/lib/server-db";
import { workspaceMember } from "@my-better-t-app/db/schema";
import { and, eq, isNull } from "drizzle-orm";

export async function POST(req: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return new Response("Unauthorized", { status: 401 });
    }

    const contentType = req.headers.get("content-type");
    let socketId: string | null = null;
    let channel: string | null = null;

    if (contentType?.includes("application/x-www-form-urlencoded")) {
      const body = await req.formData();
      socketId = body.get("socket_id") as string;
      channel = body.get("channel_name") as string;
    } else {
      const body = (await req.json()) as { socket_id?: string; channel_name?: string };
      socketId = body.socket_id ?? null;
      channel = body.channel_name ?? null;
    }

    if (!socketId || !channel) {
      return new Response("Missing socket_id or channel_name", { status: 400 });
    }

    // Expected channel format: private-inbox:workspaceId
    const workspaceId = channel.replace("private-inbox:", "");

    if (!workspaceId || workspaceId === channel) {
      return new Response("Invalid channel format", { status: 400 });
    }

    // Verify membership
    const membership = await db.query.workspaceMember.findFirst({
      where: and(
        eq(workspaceMember.workspaceId, workspaceId),
        eq(workspaceMember.userId, session.user.id),
        isNull(workspaceMember.deletedAt),
      ),
    });

    if (!membership) {
      console.warn(`[PusherAuth] Forbidden: User ${session.user.id} not in workspace ${workspaceId}`);
      return new Response("Forbidden", { status: 403 });
    }

    const pusher = await getPusherServer();
    if (!pusher) {
      console.error("[PusherAuth] Pusher not configured");
      return new Response("Pusher not configured", { status: 500 });
    }

    const authResponse = pusher.authenticate(socketId, channel);
    return NextResponse.json(authResponse);
  } catch (error) {
    console.error("[PusherAuth] Internal Server Error:", error);
    return new Response(error instanceof Error ? error.message : "Internal Server Error", {
      status: 500,
    });
  }
}
