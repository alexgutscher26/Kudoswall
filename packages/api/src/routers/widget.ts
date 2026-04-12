import { protectedProcedure, router, publicProcedure } from "../index";
import { widget, workspace, project, testimonial } from "@my-better-t-app/db/schema";
import { eq, and, desc, inArray, gte, isNull } from "drizzle-orm";
import { recordAuditLog } from "@my-better-t-app/db";
import { z } from "zod";

const widgetSettingsSchema = z.object({
  // Layout & Display
  layout: z.enum(["grid", "masonry", "carousel"]),
  theme: z.enum(["light", "dark", "auto"]),
  maxItems: z.number().default(20),
  showRating: z.boolean().default(true),

  // Pro Layout
  carouselAutoAdvance: z.boolean().optional(),
  carouselInterval: z.number().optional(),
  carouselShowArrows: z.boolean().optional(),
  columnsOverride: z.number().nullable().optional(),
  cardBorderRadius: z.enum(["none", "small", "large", "pill"]).optional(),
  cardShadow: z.enum(["none", "subtle", "medium"]).optional(),
  showReviewerPhoto: z.boolean().optional(),
  showReviewerCompany: z.boolean().optional(),
  showDate: z.boolean().optional(),
  truncateText: z.union([z.literal("off"), z.number()]).optional(),

  // Filtering & Curation
  filterTags: z.array(z.string()).optional(),
  filterMinRating: z.number().optional(),
  filterType: z.enum(["all", "text", "video"]).optional(),
  pinnedIds: z.array(z.string()).optional(),
  excludedIds: z.array(z.string()).optional(),

  // Branding
  accentColor: z.string().default("#e8527a"),
  backgroundColor: z.string().default("transparent"),
  textColor: z.string().nullable().optional(),
  hideBadge: z.boolean().optional(),

  // Advanced
  locale: z.string().default("en"),
  animation: z.enum(["fade", "none"]).default("fade"),
  headerTitle: z.string().optional(),
  headerRating: z.number().optional(),
  headerReviewCount: z.number().optional(),
  headerAutoStats: z.boolean().default(true),
  hideHeader: z.boolean().optional(),
});

export const widgetRouter = router({
  list: protectedProcedure.query(async ({ ctx }) => {
    const { db, session } = ctx;

    const ws = await db.query.workspace.findFirst({
      where: eq(workspace.ownerId, session.user.id),
    });

    if (!ws) return [];

    return db.query.widget.findMany({
      where: and(eq(widget.workspaceId, ws.id), isNull(widget.deletedAt)),
      orderBy: desc(widget.createdAt),
    });
  }),

  getById: protectedProcedure.input(z.object({ id: z.string() })).query(async ({ ctx, input }) => {
    const { db, session } = ctx;

    const w = await db.query.widget.findFirst({
      where: and(eq(widget.id, input.id), isNull(widget.deletedAt)),
      with: {
        workspace: true,
      },
    });

    if (!w || w.workspace.ownerId !== session.user.id) {
      throw new Error("Not found or forbidden");
    }

    return w;
  }),

  create: protectedProcedure
    .input(z.object({ name: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { db, session } = ctx;

      const ws = await db.query.workspace.findFirst({
        where: eq(workspace.ownerId, session.user.id),
      });

      if (!ws) throw new Error("Workspace not found");

      const id = crypto.randomUUID();
      const defaultSettings = {
        layout: "grid",
        theme: "light", // Default to light to match preview
        maxItems: 20,
        showRating: true,
        showReviewerPhoto: true,
        showReviewerCompany: true,
        showDate: true,
        cardBorderRadius: "small", // 12px
        cardShadow: "subtle",
        accentColor: "#e8527a",
        backgroundColor: "transparent",
        maxWidth: 800,
        headerTitle: "What our customers say",
        headerRating: 4.9,
        headerReviewCount: 128,
        headerAutoStats: true,
        hideHeader: false,
        locale: "en",
        animation: "fade",
      };

      await db.insert(widget).values({
        id,
        workspaceId: ws.id,
        name: input.name,
        settingsJson: JSON.stringify(defaultSettings),
      });

      await recordAuditLog({
        userId: session.user.id,
        entityType: "widget",
        entityId: id,
        action: "create",
        diff: { name: input.name, settings: defaultSettings },
      });

      return { id };
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().optional(),
        settings: widgetSettingsSchema,
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { db, session } = ctx;

      const w = await db.query.widget.findFirst({
        where: and(eq(widget.id, input.id), isNull(widget.deletedAt)),
        with: {
          workspace: true,
        },
      });

      if (!w || w.workspace.ownerId !== session.user.id) {
        throw new Error("Forbidden");
      }

      await db
        .update(widget)
        .set({
          name: input.name ?? w.name,
          settingsJson: JSON.stringify(input.settings),
        })
        .where(eq(widget.id, input.id));

      await recordAuditLog({
        userId: session.user.id,
        entityType: "widget",
        entityId: input.id,
        action: "update",
        diff: { name: input.name, settings: input.settings },
      });

      return { success: true };
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { db, session } = ctx;

      const w = await db.query.widget.findFirst({
        where: eq(widget.id, input.id),
        with: {
          workspace: true,
        },
      });

      if (!w || w.workspace.ownerId !== session.user.id) {
        throw new Error("Forbidden");
      }

      await db.update(widget).set({ deletedAt: new Date() }).where(eq(widget.id, input.id));

      await recordAuditLog({
        userId: session.user.id,
        entityType: "widget",
        entityId: input.id,
        action: "delete",
      });

      return { success: true };
    }),

  /**
   * Public procedure to fetch data for the widget.
   */
  getPublicData: publicProcedure
    .input(z.object({ widgetId: z.string() }))
    .query(async ({ ctx, input }) => {
      const { db } = ctx;

      const w = await db.query.widget.findFirst({
        where: eq(widget.id, input.widgetId),
        with: {
          workspace: true,
        },
      });

      if (!w) throw new Error("Widget not found");

      const settings = JSON.parse(w.settingsJson);

      // Fetch testimonials based on workspace and filters
      // For now, we fetch from all projects in the workspace
      const projects = await db.query.project.findMany({
        where: eq(project.workspaceId, w.workspaceId),
      });

      if (projects.length === 0) return { widget: w, testimonials: [] };

      const projectIds = projects.map((p) => p.id);

      // Base query for approved testimonials
      let testimonials = await db.query.testimonial.findMany({
        where: and(
          inArray(testimonial.projectId, projectIds),
          eq(testimonial.status, "approved"),
          settings.filterMinRating ? gte(testimonial.rating, settings.filterMinRating) : undefined,
          settings.filterType && settings.filterType !== "all"
            ? eq(testimonial.type, settings.filterType)
            : undefined,
        ),
        orderBy: desc(testimonial.createdAt),
        limit: settings.maxItems || 20,
        with: {
          testimonialToTags: {
            with: {
              tag: true,
            },
          },
        },
      });

      // TODO: Implement tag filtering in DB if possible, or filter here for now
      if (settings.filterTags && settings.filterTags.length > 0) {
        testimonials = testimonials.filter((t) =>
          t.testimonialToTags.some((tt) => settings.filterTags.includes(tt.tag.name)),
        );
      }

      return {
        widget: {
          ...w,
          settings,
        },
        testimonials,
      };
    }),
});
