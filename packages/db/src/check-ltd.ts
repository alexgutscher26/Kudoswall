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

  console.log(`--- Diagnostics for ID: ${targetId} ---`);

  // Check User
  const u = await db.query.user.findFirst({
    where: eq(user.id, targetId),
  });
  console.log(`User Table: ${u ? `Found (Email: ${u.email}, Plan: ${u.plan})` : "Not Found"}`);

  // Check Organization
  const orgs = await db.query.organization.findMany({
    where: or(eq(organization.id, targetId), eq(organization.ownerId, targetId)),
  });
  console.log(
    `Organization Table: ${orgs.length > 0 ? orgs.map((o) => `Found (ID: ${o.id}, Name: ${o.name}, Plan: ${o.plan})`).join(", ") : "Not Found"}`,
  );

  // Check Workspace
  const wss = await db.query.workspace.findMany({
    where: or(eq(workspace.id, targetId), eq(workspace.ownerId, targetId)),
  });
  console.log(
    `Workspace Table: ${wss.length > 0 ? wss.map((w) => `Found (ID: ${w.id}, Name: ${w.name}, Plan: ${w.plan})`).join(", ") : "Not Found"}`,
  );

  process.exit(0);
}

main().catch(console.error);
