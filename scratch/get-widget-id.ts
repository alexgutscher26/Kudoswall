
import { createDb } from "../packages/db/src/index";
import { widget } from "../packages/db/src/schema/app";

async function getWidget() {
  const db = createDb();
  const w = await db.select().from(widget).limit(1);
  console.log(w[0]?.id);
  process.exit(0);
}

getWidget().catch(console.error);
