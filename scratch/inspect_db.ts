import { db } from "./apps/web/src/lib/server-db";
import { testimonial } from "./packages/db/src/schema/app";
import { isNull, eq } from "drizzle-orm";

async function main() {
  const allTestimonials = await db.query.testimonial.findMany({
    where: isNull(testimonial.deletedAt),
    limit: 10,
  });
  console.log("Found testimonials:", allTestimonials.map(t => ({ id: t.id, workspaceId: t.workspaceId })));
}

main().catch(console.error);
