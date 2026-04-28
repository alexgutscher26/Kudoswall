import { workspaceProcedure, router, publicProcedure } from "../index";
import { widget, project, testimonial, testimonialToTag, tag } from "@my-better-t-app/db/schema";
import { eq, and, desc, inArray, gte, isNull, exists } from "drizzle-orm";
import { recordAuditLog } from "@my-better-t-app/db";
import { z } from "zod";
import { purgeWidgetCache } from "../utils/purge";
import { getEnvAsync } from "@my-better-t-app/env/server";

const widgetSettingsSchema = z.object({
  // Layout & Display
  layout: z.enum(["grid", "masonry", "carousel", "bento"]),
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
  filterProjectIds: z.array(z.string()).optional(),
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
  fontFamily: z.string().default("sans"),
  customFontUrl: z.string().optional(),
  customFontName: z.string().optional(),
  headerTitle: z.string().optional(),
  headerRating: z.number().optional(),
  headerReviewCount: z.number().optional(),
  headerAutoStats: z.boolean().default(true),
  hideHeader: z.boolean().optional(),
});

export const widgetRouter = router({
  list: workspaceProcedure.query(async ({ ctx }) => {
    const { db } = ctx;

    return db.query.widget.findMany({
      where: isNull(widget.deletedAt),
      orderBy: desc(widget.createdAt),
    });
  }),

  getById: workspaceProcedure.input(z.object({ id: z.string() })).query(async ({ ctx, input }) => {
    const { db } = ctx;

    const w = await db.query.widget.findFirst({
      where: and(eq(widget.id, input.id), isNull(widget.deletedAt)),
    });

    if (!w) {
      throw new Error("Not found or forbidden");
    }

    return w;
  }),

  create: workspaceProcedure
    .input(z.object({ name: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { db, session, workspaceId } = ctx;

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
        workspaceId,
        name: input.name,
        settingsJson: JSON.stringify(defaultSettings),
      });

      await recordAuditLog({
        userId: session.user.id,
        workspaceId,
        entityType: "widget",
        entityId: id,
        action: "create",
        diff: { name: input.name, settings: defaultSettings },
      });

      return { id };
    }),

  update: workspaceProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().optional(),
        settings: widgetSettingsSchema,
        customCss: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { db, session, workspaceId } = ctx;

      const w = await db.query.widget.findFirst({
        where: and(eq(widget.id, input.id), isNull(widget.deletedAt)),
        with: {
          workspace: {
            with: { organization: true },
          },
        },

      });

      if (!w) {
        throw new Error("Forbidden or not found");
      }

      const { getWorkspacePermissions } = await import("../logic/billing");
      const permissions = getWorkspacePermissions({
        plan: w.workspace.plan,
        organization: (w.workspace as any).organization,
      });
      const planConfig = permissions;


      // Enforce Layout restrictions
      if (
        (input.settings.layout === "masonry" ||
          input.settings.layout === "carousel" ||
          input.settings.layout === "bento") &&
        !planConfig.features.premiumWidgets
      ) {
        throw new Error(
          `The ${input.settings.layout} layout is a premium feature. Please upgrade to Pro.`,
        );
      }

      // Enforce Branding restrictions
      if (input.settings.hideBadge && !planConfig.features.whiteLabel) {
        throw new Error(
          "Removing the KudosWall badge is a premium feature. Please upgrade to Pro.",
        );
      }

      await db
        .update(widget)
        .set({
          name: input.name ?? w.name,
          settingsJson: JSON.stringify(input.settings),
          ...(input.customCss !== undefined ? { customCss: input.customCss } : {}),
        })
        .where(eq(widget.id, input.id));

      await recordAuditLog({
        userId: session.user.id,
        workspaceId,
        entityType: "widget",
        entityId: input.id,
        action: "update",
        diff: { name: input.name, settings: input.settings, customCss: input.customCss },
      });

      const env = await getEnvAsync();
      await purgeWidgetCache({ db, workspaceId, env });

      return { success: true };
    }),

  delete: workspaceProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { db, session, workspaceId } = ctx;

      const w = await db.query.widget.findFirst({
        where: eq(widget.id, input.id),
      });

      if (!w) {
        throw new Error("Forbidden or not found");
      }

      await db.update(widget).set({ deletedAt: new Date() }).where(eq(widget.id, input.id));

      await recordAuditLog({
        userId: session.user.id,
        workspaceId,
        entityType: "widget",
        entityId: input.id,
        action: "delete",
      });

      const env = await getEnvAsync();
      await purgeWidgetCache({ db, workspaceId, env });

      return { success: true };
    }),

  /**
   * Public procedure to fetch data for the widget.
   */
  getPublicData: publicProcedure
    .input(z.object({ widgetId: z.string() }))
    .query(async ({ ctx, input }) => {
      const { dbRead } = ctx;

      const w = await dbRead.query.widget.findFirst({
        where: eq(widget.id, input.widgetId),
        with: {
          workspace: {
            with: { organization: true },
          },
        },

      });

      if (!w) throw new Error("Widget not found");

      const settings = JSON.parse(w.settingsJson);

      // Fetch testimonials based on workspace and filters
      // For now, we fetch from all projects in the workspace
      const projects = await dbRead.query.project.findMany({
        where: eq(project.workspaceId, w.workspaceId),
      });

      if (projects.length === 0) return { widget: w, testimonials: [] };

      const projectIds = projects.map((p) => p.id);

      // Base query for approved testimonials
      // Filter by project (either all in workspace, or specific selected projects)
      const targetProjectIds =
        settings.filterProjectIds && settings.filterProjectIds.length > 0
          ? settings.filterProjectIds
          : projectIds;

      const testimonials = await dbRead.query.testimonial.findMany({
        where: and(
          inArray(testimonial.projectId, targetProjectIds),
          eq(testimonial.status, "approved"),
          isNull(testimonial.deletedAt),
          settings.filterMinRating ? gte(testimonial.rating, settings.filterMinRating) : undefined,
          settings.filterType && settings.filterType !== "all"
            ? eq(testimonial.type, settings.filterType)
            : undefined,
          settings.filterTags && settings.filterTags.length > 0
            ? exists(
                dbRead
                  .select({ id: testimonialToTag.tagId })
                  .from(testimonialToTag)
                  .innerJoin(tag, eq(tag.id, testimonialToTag.tagId))
                  .where(
                    and(
                      eq(testimonialToTag.testimonialId, testimonial.id),
                      inArray(tag.name, settings.filterTags),
                      isNull(tag.deletedAt),
                    ),
                  ),
              )
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

      return {
        widget: {
          ...w,
          settings,
        },
        testimonials,
      };
    }),
});
