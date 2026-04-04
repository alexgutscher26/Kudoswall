import { protectedProcedure, router } from "../index";
import { workspace, project, testimonial } from "@my-better-t-app/db/schema";
import { eq, and, desc, count, inArray } from "drizzle-orm";

/**
 * Helper to ensure the user has a workspace.
 */
async function getOrCreateWorkspace(db: any, userId: string, userName: string) {
  const existing = await db.query.workspace.findFirst({
    where: eq(workspace.ownerId, userId),
  });

  if (existing) return existing;

  const generateSlug = (name: string) => 
    name.toLowerCase().replace(/\s+/g, "-") + "-" + Math.random().toString(36).substring(2, 6);

  const newWorkspace = {
    id: crypto.randomUUID(),
    name: `${userName}'s Workspace`,
    slug: generateSlug(userName),
    ownerId: userId,
  };

  await db.insert(workspace).values(newWorkspace);
  return newWorkspace;
}

export const dashboardRouter = router({
  getData: protectedProcedure.query(async ({ ctx }) => {
    const { db, session } = ctx;
    const ws = await getOrCreateWorkspace(db, session.user.id, session.user.name);

    const projects = await db.query.project.findMany({
      where: eq(project.workspaceId, ws.id),
      orderBy: desc(project.createdAt),
    });

    const [testimonialCount] = await db
      .select({ value: count() })
      .from(testimonial)
      .innerJoin(project, eq(testimonial.projectId, project.id))
      .where(eq(project.workspaceId, ws.id));

    const [pendingCount] = await db
      .select({ value: count() })
      .from(testimonial)
      .innerJoin(project, eq(testimonial.projectId, project.id))
      .where(
        and(
          eq(project.workspaceId, ws.id),
          eq(testimonial.status, "pending")
        )
      );

    const recentTestimonials = projects.length > 0
      ? await db.query.testimonial.findMany({
          where: inArray(
            testimonial.projectId,
            projects.map((p: any) => p.id)
          ),
          orderBy: desc(testimonial.createdAt),
          limit: 5,
          with: {
            project: true,
          },
        })
      : [];

    return {
      workspace: ws,
      projects,
      recentTestimonials,
      stats: {
        testimonials: Number(testimonialCount?.value || 0),
        pending: Number(pendingCount?.value || 0),
        views: 0, // Mock for now
        conversion: "—", // Mock for now
      },
    };
  }),
});
