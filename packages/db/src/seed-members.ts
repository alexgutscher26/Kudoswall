import { createDb } from "./index";
import { workspace, workspaceMember } from "./schema/app";
import { isNull } from "drizzle-orm";

async function main() {
  const db = createDb();
  console.log("Seeding workspace members from existing owners...");

  const workspaces = await db.select().from(workspace).where(isNull(workspace.deletedAt));

  for (const ws of workspaces) {
    if (!ws.ownerId) continue;

    // Check if already exists
    const existing = await db.query.workspaceMember.findFirst({
      where: (members, { and, eq }) =>
        and(eq(members.workspaceId, ws.id), eq(members.userId, ws.ownerId)),
    });

    if (!existing) {
      console.log(`Adding owner ${ws.ownerId} to workspace ${ws.id}`);
      await db.insert(workspaceMember).values({
        id: crypto.randomUUID(),
        workspaceId: ws.id,
        userId: ws.ownerId,
        role: "owner",
      });
    }
  }

  console.log("Seeding complete!");
}

main().catch(console.error);
