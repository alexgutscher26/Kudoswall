import { createDb } from "./packages/db/src/index";
import { project } from "./packages/db/src/schema/app";

async function main() {
  const db = createDb();
  const p = await db.select().from(project).limit(1);
  if (p.length > 0) {
    console.log("PROJECT_SLUG=" + (p[0].collectionSlug || p[0].slug));
  } else {
    console.log("NO_PROJECT_FOUND");
  }
  process.exit(0);
}

main();
