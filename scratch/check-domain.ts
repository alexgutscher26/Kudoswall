import { db } from "./packages/api/src/lib/server-db";
import { project } from "./packages/db/src/schema/app";
import { eq } from "drizzle-orm";

async function checkDomain() {
  const host = "threddiq.kudoswall.org";
  const projectData = await db.query.project.findFirst({
    where: eq(project.customDomain, host),
  });

  console.log("Project with domain", host, ":", projectData);
}

checkDomain().catch(console.error);
