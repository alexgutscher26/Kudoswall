import { createDb } from "./index";
import { user, organization, workspace } from "./schema";
import { eq, or } from "drizzle-orm";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../../../apps/web/.env") });

async function main() {
  const db = createDb();
  const targetId = "rjjLZJWahp77h73FkouP3huvTUeyLyjj";

  console.log(`--- Granting LTD for ID: ${targetId} ---`);

  // 1. Update User
  const userResult = await db
    .update(user)
    .set({ plan: "ltd" })
    .where(eq(user.id, targetId))
    .returning({ id: user.id, plan: user.plan });

  if (userResult.length > 0) {
    console.log(`✅ Updated User ${targetId}: new plan is ${userResult[0].plan}`);
  } else {
    console.log(`⚠️ User ${targetId} not found for update`);
  }

  // 2. Update Organizations owned by this user
  const orgResult = await db
    .update(organization)
    .set({ plan: "ltd" })
    .where(or(eq(organization.id, targetId), eq(organization.ownerId, targetId)))
    .returning({ id: organization.id, plan: organization.plan });

  if (orgResult.length > 0) {
    orgResult.forEach((o) => console.log(`✅ Updated Organization ${o.id}: new plan is ${o.plan}`));
  }

  // 3. Update Workspaces owned by this user
  const wsResult = await db
    .update(workspace)
    .set({ plan: "ltd" })
    .where(or(eq(workspace.id, targetId), eq(workspace.ownerId, targetId)))
    .returning({ id: workspace.id, plan: workspace.plan });

  if (wsResult.length > 0) {
    wsResult.forEach((w) => console.log(`✅ Updated Workspace ${w.id}: new plan is ${w.plan}`));
  }

  console.log("--- Final Verification ---");
  const finalUser = await db.query.user.findFirst({ where: eq(user.id, targetId) });
  console.log(`Final User Plan: ${finalUser?.plan}`);

  process.exit(0);
}

main().catch(console.error);
