
import { createDb } from "../packages/db/src/index";
import * as schema from "../packages/db/src/schema/app";
import { desc } from "drizzle-orm";

async function checkTestimonials() {
  const db = createDb();
  const ts = await db.select().from(schema.testimonial).orderBy(desc(schema.testimonial.createdAt)).limit(5);
  console.log(JSON.stringify(ts, null, 2));
  process.exit(0);
}

checkTestimonials().catch(console.error);
