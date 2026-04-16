import { createDb } from "./index";
import { workspace, project } from "./schema/app";
import { user } from "./schema/auth";
import { nanoid } from "nanoid";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve("../../apps/web/.env") });

async function seed() {
  console.log("🌱 Seeding Neon database...");
  const db = createDb();

  try {
    const userId = "system";

    // Create system user
    await db
      .insert(user)
      .values({
        id: userId,
        name: "System User",
        email: "system@kudoswall.org",
      })
      .onConflictDoNothing();

    const wsId = `ws_${nanoid()}`;
    await db.insert(workspace).values({
      id: wsId,
      name: "Test Workspace",
      slug: "test-workspace",
      ownerId: userId,
      onboardingStatus: JSON.stringify({ completed: true }),
      plan: "free" as const,
    });

    await db.insert(project).values({
      id: `proj_${nanoid()}`,
      name: "Test Project",
      slug: "test-project",
      workspaceId: wsId,
    });

    console.log("✅ Seed complete!");
    console.log("Workspace: test-workspace");
    console.log("Project: test-project");
  } catch (err: any) {
    console.error("❌ Seed FAILED!");
    console.error(err);
  } finally {
    process.exit();
  }
}

seed();
