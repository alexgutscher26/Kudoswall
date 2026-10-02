import { createHash } from "node:crypto";
import { protectedProcedure, publicAnalyticsProcedure, router } from "../index";
import {
  workspace,
  project,
  testimonial,
  widget,
  analyticsEvent,
  user,
} from "@my-better-t-app/db/schema";
import { eq, and, desc, count, sql, gte, inArray } from "drizzle-orm";
import { z } from "zod";
import {
  subDays,
  startOfDay,
  eachDayOfInterval,
  format,
  differenceInDays,
  addDays,
} from "date-fns";

const timeframeSchema = z.enum(["7d", "30d", "90d", "all"]).optional();

const getTimefilter = (timeframe?: string) => {
  if (!timeframe || timeframe === "all") return null;
  const days = timeframe === "7d" ? 7 : timeframe === "30d" ? 30 : 90;
  return subDays(new Date(), days);
};

export const analyticsRouter = router({
  trackEvent: publicAnalyticsProcedure
    .input(
      z.object({
        workspaceId: z.string(),
        projectId: z.string().optional(),
        widgetId: z.string().optional(),
        eventType: z.enum([
          "view",
          "click",
          "video_play",
          "video_progress",
          "collection_view",
          "collection_step_view",
          "collection_step_complete",
          "collection_submit",
        ]),
        metadataJson: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { db, req } = ctx;
      const ip = req.headers.get("x-forwarded-for") || "127.0.0.1";
      const ua = req.headers.get("user-agent") || "";

      // Create a privacy-preserving hash of IP + User Agent
      const visitorId = createHash("sha256").update(`${ip}-${ua}`).digest("hex");

      const id = crypto.randomUUID();
      await db.insert(analyticsEvent).values({
        id: id,
        workspaceId: input.workspaceId,
        projectId: input.projectId,
        widgetId: input.widgetId,
        visitorId: visitorId,
        eventType: input.eventType,
        metadataJson: input.metadataJson,
      });

      // --- Referral Activation Trigger ---
      if (input.eventType === "view" && input.widgetId) {
        try {
          const ws = await db.query.workspace.findFirst({
            where: eq(workspace.id, input.workspaceId),
          });

          if (ws) {
            const owner = await db.query.user.findFirst({
              where: eq(user.id, ws.ownerId),
            });

            // Only activate if they have a referrer and haven't been activated yet
            if (owner?.referredById && !owner.referralActivatedAt) {
              console.log(
                `[REFERRAL] Activation Triggered: User ${owner.id} (referred by ${owner.referredById})`,
              );

              const now = new Date();

              await db.transaction(async (tx) => {
                // 1. Mark the referred user as activated
                await tx
                  .update(user)
                  .set({ referralActivatedAt: now })
                  .where(eq(user.id, owner.id));

                // 2. Reward the Referrer (Find their primary workspace)
                const referrerWorkspace = await tx.query.workspace.findFirst({
                  where: eq(workspace.ownerId, owner.referredById!),
                });

                if (referrerWorkspace) {
                  const currentBadgeEnd = referrerWorkspace.badgeRemovedUntil;
                  // If they already have an active reward, stack it. Otherwise, start from now.
                  const baseDate =
                    currentBadgeEnd && new Date(currentBadgeEnd) > now
                      ? new Date(currentBadgeEnd)
                      : now;
                  const newBadgeEnd = addDays(baseDate, 30);

                  await tx
                    .update(workspace)
                    .set({ badgeRemovedUntil: newBadgeEnd })
                    .where(eq(workspace.id, referrerWorkspace.id));

                  console.log(
                    `[REFERRAL] Referrer ${owner.referredById} rewarded until ${newBadgeEnd.toISOString()}`,
                  );
                }

                // 3. Reward the Referred User (Initial 30 days)
                const currentUserBadgeEnd = ws.badgeRemovedUntil;
                const referredBaseDate =
                  currentUserBadgeEnd && new Date(currentUserBadgeEnd) > now
                    ? new Date(currentUserBadgeEnd)
                    : now;
                const referredNewBadgeEnd = addDays(referredBaseDate, 30);

                await tx
                  .update(workspace)
                  .set({ badgeRemovedUntil: referredNewBadgeEnd })
                  .where(eq(workspace.id, ws.id));

                console.log(
                  `[REFERRAL] Referred User ${owner.id} rewarded until ${referredNewBadgeEnd.toISOString()}`,
                );
              });
            }
          }
        } catch (error) {
          console.error("[REFERRAL] Critical Error during activation:", error);
        }
      }

      return { success: true };
    }),

  getOverview: protectedProcedure
    .input(z.object({ timeframe: timeframeSchema, workspaceId: z.string().optional() }))
    .query(async ({ ctx, input }) => {
      const { db, session } = ctx;
      const { workspaceId } = input;

      let ws;
      if (workspaceId) {
        ws = await db.query.workspace.findFirst({
          where: and(eq(workspace.id, workspaceId), eq(workspace.ownerId, session.user.id)),
          with: { organization: true },
        });
      }

      if (!ws) {
        ws = await db.query.workspace.findFirst({
          where: eq(workspace.ownerId, session.user.id),
          with: { organization: true },
        });
      }

      if (!ws) throw new Error("No workspace found");

      const { getWorkspacePermissions } = await import("../logic/billing");
      const permissions = getWorkspacePermissions({
        plan: ws.plan,
        organization: (ws as any).organization,
      });

      if (!permissions.features.analytics) {
        // Trigger upgrade prompt email
        const { triggerUpgradePrompt } = await import("../utils/upgrade-prompts");
        await triggerUpgradePrompt({
          db,
          workspaceId: ws.id,
          userName: session.user.name || "there",
          userEmail: session.user.email || "",
          type: "analytics-access",
        });

        throw new Error("Analytics is not available on your current plan. Please upgrade.");
      }

      const daysNum =
        input.timeframe === "30d"
          ? 30
          : input.timeframe === "90d"
            ? 90
            : input.timeframe === "all"
              ? 0
              : 7;
      const startDate = daysNum > 0 ? subDays(new Date(), daysNum) : null;
      const prevStartDate = daysNum > 0 ? subDays(new Date(), daysNum * 2) : null;

      // Current stats
      const [viewsResult] = await db
        .select({ value: count() })
        .from(analyticsEvent)
        .where(
          and(
            eq(analyticsEvent.workspaceId, ws.id),
            eq(analyticsEvent.eventType, "view"),
            startDate ? gte(analyticsEvent.createdAt, startDate) : undefined,
          ),
        );

      const [testimonialResult] = await db
        .select({ value: count() })
        .from(testimonial)
        .innerJoin(project, eq(testimonial.projectId, project.id))
        .where(
          and(
            eq(project.workspaceId, ws.id),
            startDate ? gte(testimonial.createdAt, startDate) : undefined,
          ),
        );

      // Previous stats for change calculation
      let prevViews = 0;
      let prevSubmissions = 0;

      if (startDate && prevStartDate) {
        const [prevViewsResult] = await db
          .select({ value: count() })
          .from(analyticsEvent)
          .where(
            and(
              eq(analyticsEvent.workspaceId, ws.id),
              eq(analyticsEvent.eventType, "view"),
              gte(analyticsEvent.createdAt, prevStartDate),
              sql`${analyticsEvent.createdAt} < ${startDate}`,
            ),
          );
        prevViews = Number(prevViewsResult?.value || 0);

        const [prevSubmissionsResult] = await db
          .select({ value: count() })
          .from(testimonial)
          .innerJoin(project, eq(testimonial.projectId, project.id))
          .where(
            and(
              eq(project.workspaceId, ws.id),
              gte(testimonial.createdAt, prevStartDate),
              sql`${testimonial.createdAt} < ${startDate}`,
            ),
          );
        prevSubmissions = Number(prevSubmissionsResult?.value || 0);
      }

      const views = Number(viewsResult?.value || 0);
      const submissions = Number(testimonialResult?.value || 0);

      const calcChange = (current: number, previous: number) => {
        if (previous === 0) return current > 0 ? "+100%" : "0%";
        const change = ((current - previous) / previous) * 100;
        return (change >= 0 ? "+" : "") + change.toFixed(0) + "%";
      };

      const viewsChange = calcChange(views, prevViews);
      const submissionsChange = calcChange(submissions, prevSubmissions);

      const conversionRate = views > 0 ? ((submissions / views) * 100).toFixed(1) + "%" : "0%";
      const prevConversionRate = prevViews > 0 ? prevSubmissions / prevViews : 0;
      const currentConvRate = views > 0 ? submissions / views : 0;
      const conversionChange =
        prevConversionRate === 0
          ? currentConvRate > 0
            ? "+100%"
            : "0%"
          : (((currentConvRate - prevConversionRate) / prevConversionRate) * 100).toFixed(0) + "%";

      // Unique visitors
      const [uniqueViewsResult] = await db
        .select({ value: sql<number>`count(distinct ${analyticsEvent.visitorId})` })
        .from(analyticsEvent)
        .where(
          and(
            eq(analyticsEvent.workspaceId, ws.id),
            eq(analyticsEvent.eventType, "view"),
            startDate ? gte(analyticsEvent.createdAt, startDate) : undefined,
          ),
        );

      let prevUniqueViews = 0;
      if (startDate && prevStartDate) {
        const [prevUniqueViewsResult] = await db
          .select({ value: sql<number>`count(distinct ${analyticsEvent.visitorId})` })
          .from(analyticsEvent)
          .where(
            and(
              eq(analyticsEvent.workspaceId, ws.id),
              eq(analyticsEvent.eventType, "view"),
              gte(analyticsEvent.createdAt, prevStartDate),
              sql`${analyticsEvent.createdAt} < ${startDate}`,
            ),
          );
        prevUniqueViews = Number(prevUniqueViewsResult?.value || 0);
      }

      const uniqueViews = Number(uniqueViewsResult?.value || 0);
      const uniqueViewsChange = calcChange(uniqueViews, prevUniqueViews);

      return {
        totalViews: views.toLocaleString(),
        uniqueVisitors: uniqueViews.toLocaleString(),
        totalTestimonials: submissions.toLocaleString(),
        newTestimonials: submissions,
        conversionRate,
        viewsChange,
        uniqueVisitorsChange: uniqueViewsChange,
        submissionsChange,
        conversionChange,
        viewsRaw: views,
        submissionsRaw: submissions,
      };
    }),

  getChartData: protectedProcedure
    .input(z.object({ timeframe: timeframeSchema, workspaceId: z.string().optional() }))
    .query(async ({ ctx, input }) => {
      const { db, session } = ctx;
      const { workspaceId } = input;

      let ws;
      if (workspaceId) {
        ws = await db.query.workspace.findFirst({
          where: and(eq(workspace.id, workspaceId), eq(workspace.ownerId, session.user.id)),
          with: { organization: true },
        });
      }

      if (!ws) {
        ws = await db.query.workspace.findFirst({
          where: eq(workspace.ownerId, session.user.id),
          with: { organization: true },
        });
      }

      if (!ws) throw new Error("No workspace found");

      const { getWorkspacePermissions } = await import("../logic/billing");
      const permissions = getWorkspacePermissions({
        plan: ws.plan,
        organization: (ws as any).organization,
      });

      if (!permissions.features.analytics) {
        throw new Error("Analytics is not available on your current plan. Please upgrade.");
      }

      let daysNum = 7;
      if (input.timeframe === "30d") daysNum = 30;
      if (input.timeframe === "90d") daysNum = 90;
      if (input.timeframe === "all") {
        const firstEvent = await db.query.analyticsEvent.findFirst({
          where: eq(analyticsEvent.workspaceId, ws.id),
          orderBy: [analyticsEvent.createdAt],
        });
        daysNum = firstEvent ? differenceInDays(new Date(), firstEvent.createdAt) + 1 : 7;
      }

      const startDate = subDays(startOfDay(new Date()), daysNum - 1);

      const stats = await db
        .select({
          dayStr: sql<string>`TO_CHAR(${analyticsEvent.createdAt}, 'YYYY-MM-DD')`.as("day_str"),
          count: count(),
        })
        .from(analyticsEvent)
        .where(
          and(
            eq(analyticsEvent.workspaceId, ws.id),
            eq(analyticsEvent.eventType, "view"),
            gte(analyticsEvent.createdAt, startDate),
          ),
        )
        .groupBy(sql`day_str`)
        .orderBy(sql`day_str`);

      const interval = eachDayOfInterval({ start: startDate, end: new Date() });
      const chartData = interval.map((dateObj: Date) => {
        const xLabel = daysNum > 30 ? format(dateObj, "MMM d") : format(dateObj, "EEE");
        const matchStr = format(dateObj, "yyyy-MM-dd");
        const found = stats.find((s) => s.dayStr === matchStr);
        return {
          name: xLabel,
          views: Number(found?.count || 0),
        };
      });

      return chartData;
    }),

  getWidgetPerformance: protectedProcedure
    .input(z.object({ timeframe: timeframeSchema, workspaceId: z.string().optional() }))
    .query(async ({ ctx, input }) => {
      const { db, session } = ctx;
      const { workspaceId } = input;
      const start = getTimefilter(input.timeframe);

      let ws;
      if (workspaceId) {
        ws = await db.query.workspace.findFirst({
          where: and(eq(workspace.id, workspaceId), eq(workspace.ownerId, session.user.id)),
          with: { organization: true },
        });
      }

      if (!ws) {
        ws = await db.query.workspace.findFirst({
          where: eq(workspace.ownerId, session.user.id),
          with: { organization: true },
        });
      }

      if (!ws) throw new Error("No workspace found");

      const { getWorkspacePermissions } = await import("../logic/billing");
      const permissions = getWorkspacePermissions({
        plan: ws.plan,
        organization: (ws as any).organization,
      });

      if (!permissions.features.analytics) {
        throw new Error("Analytics is not available on your current plan. Please upgrade.");
      }

      const widgets = await db.query.widget.findMany({
        where: eq(widget.workspaceId, ws.id),
      });

      let stats: { widgetId: string | null; eventType: string; value: number }[] = [];

      if (widgets.length > 0) {
        const widgetIds = widgets.map((w) => w.id);

        stats = await db
          .select({
            widgetId: analyticsEvent.widgetId,
            eventType: analyticsEvent.eventType,
            value: count(),
          })
          .from(analyticsEvent)
          .where(
            and(
              inArray(analyticsEvent.widgetId, widgetIds),
              inArray(analyticsEvent.eventType, ["view", "click"]),
              start ? gte(analyticsEvent.createdAt, start) : undefined,
            ),
          )
          .groupBy(analyticsEvent.widgetId, analyticsEvent.eventType);
      }

      const statsMap = stats.reduce(
        (acc, row) => {
          if (!row.widgetId || !row.eventType) return acc;
          let entry = acc[row.widgetId];
          if (!entry) {
            entry = { view: 0, click: 0 };
            acc[row.widgetId] = entry;
          }
          if (row.eventType === "view" || row.eventType === "click") {
            entry[row.eventType] = Number(row.value);
          }
          return acc;
        },
        {} as Record<string, { view: number; click: number }>,
      );

      const performance = widgets.map((w) => {
        const v = statsMap[w.id]?.view || 0;
        const c = statsMap[w.id]?.click || 0;
        const ctrVal = v > 0 ? ((c / v) * 100).toFixed(1) + "%" : "0%";

        return {
          name: w.name,
          views: v,
          clicks: c,
          ctr: ctrVal,
        };
      });

      return performance;
    }),

  getExportData: protectedProcedure
    .input(z.object({ timeframe: timeframeSchema, workspaceId: z.string().optional() }))
    .query(async ({ ctx, input }) => {
      const { db, session } = ctx;
      const { workspaceId } = input;
      const start = getTimefilter(input.timeframe);

      let ws;
      if (workspaceId) {
        ws = await db.query.workspace.findFirst({
          where: and(eq(workspace.id, workspaceId), eq(workspace.ownerId, session.user.id)),
          with: { organization: true },
        });
      }

      if (!ws) {
        ws = await db.query.workspace.findFirst({
          where: eq(workspace.ownerId, session.user.id),
          with: { organization: true },
        });
      }

      if (!ws) throw new Error("No workspace found");

      const { getWorkspacePermissions } = await import("../logic/billing");
      const permissions = getWorkspacePermissions({
        plan: ws.plan,
        organization: (ws as any).organization,
      });

      if (!permissions.features.csvExport) {
        throw new Error("CSV Export is not available on your plan.");
      }

      const widgets = await db.query.widget.findMany({
        where: eq(widget.workspaceId, ws.id),
      });

      let stats: { widgetId: string | null; eventType: string; value: number }[] = [];

      if (widgets.length > 0) {
        const widgetIds = widgets.map((w) => w.id);

        stats = await db
          .select({
            widgetId: analyticsEvent.widgetId,
            eventType: analyticsEvent.eventType,
            value: count(),
          })
          .from(analyticsEvent)
          .where(
            and(
              inArray(analyticsEvent.widgetId, widgetIds),
              inArray(analyticsEvent.eventType, ["view", "click"]),
              start ? gte(analyticsEvent.createdAt, start) : undefined,
            ),
          )
          .groupBy(analyticsEvent.widgetId, analyticsEvent.eventType);
      }

      const statsMap = stats.reduce(
        (acc, row) => {
          if (!row.widgetId || !row.eventType) return acc;
          let entry = acc[row.widgetId];
          if (!entry) {
            entry = { view: 0, click: 0 };
            acc[row.widgetId] = entry;
          }
          if (row.eventType === "view" || row.eventType === "click") {
            entry[row.eventType] = Number(row.value);
          }
          return acc;
        },
        {} as Record<string, { view: number; click: number }>,
      );

      const performance = widgets.map((w) => {
        const v = statsMap[w.id]?.view || 0;
        const c = statsMap[w.id]?.click || 0;
        const ctrVal = v > 0 ? ((c / v) * 100).toFixed(1) + "%" : "0%";

        return {
          "Widget Name": w.name,
          Views: v,
          Clicks: c,
          CTR: ctrVal,
          "Created At": format(w.createdAt, "yyyy-MM-dd HH:mm:ss"),
        };
      });

      return performance;
    }),

  getTopTestimonials: protectedProcedure
    .input(z.object({ workspaceId: z.string().optional() }).optional())
    .query(async ({ ctx, input }) => {
      const { db, session } = ctx;
      const workspaceId = input?.workspaceId;

      let ws;
      if (workspaceId) {
        ws = await db.query.workspace.findFirst({
          where: and(eq(workspace.id, workspaceId), eq(workspace.ownerId, session.user.id)),
          with: { organization: true },
        });
      }

      if (!ws) {
        ws = await db.query.workspace.findFirst({
          where: eq(workspace.ownerId, session.user.id),
          with: { organization: true },
        });
      }

      if (!ws) throw new Error("No workspace found");

      const { getWorkspacePermissions } = await import("../logic/billing");
      const permissions = getWorkspacePermissions({
        plan: ws.plan,
        organization: (ws as any).organization,
      });

      if (!permissions.features.analytics) {
        throw new Error("Analytics is not available on your current plan. Please upgrade.");
      }

      const top = await db.query.testimonial.findMany({
        where: and(
          inArray(
            testimonial.projectId,
            db.select({ id: project.id }).from(project).where(eq(project.workspaceId, ws.id)),
          ),
          eq(testimonial.status, "approved"),
        ),
        orderBy: desc(testimonial.rating),
        limit: 5,
      });

      return top.map((t) => ({
        author: t.authorName || "Anonymous",
        company: t.authorCompany || "",
        rating: t.rating,
      }));
    }),

  getCollectionFunnel: protectedProcedure
    .input(
      z.object({
        workspaceId: z.string(),
        projectId: z.string().optional(),
        timeframe: timeframeSchema,
      }),
    )
    .query(async ({ ctx, input }) => {
      const { db, session } = ctx;
      const { workspaceId, projectId, timeframe } = input;

      const ws = await db.query.workspace.findFirst({
        where: and(eq(workspace.id, workspaceId), eq(workspace.ownerId, session.user.id)),
        with: { organization: true },
      });

      if (!ws) throw new Error("Workspace not found or unauthorized");

      const { getWorkspacePermissions } = await import("../logic/billing");
      const permissions = getWorkspacePermissions({
        plan: ws.plan,
        organization: (ws as any).organization,
      });

      if (!permissions.features.analytics) {
        throw new Error("Analytics is not available on your current plan. Please upgrade.");
      }

      const daysNum =
        timeframe === "30d" ? 30 : timeframe === "90d" ? 90 : timeframe === "all" ? 0 : 7;
      const startDate = daysNum > 0 ? subDays(new Date(), daysNum) : null;

      // Determine target project(s)
      let targetProjects = await db.query.project.findMany({
        where: projectId
          ? and(eq(project.id, projectId), eq(project.workspaceId, ws.id))
          : eq(project.workspaceId, ws.id),
      });

      if (targetProjects.length === 0 && projectId) {
        throw new Error("Project not found");
      }

      const projectIds = targetProjects.map((p) => p.id);

      // Fetch all relevant collection events
      const rawEvents = await db.query.analyticsEvent.findMany({
        where: and(
          eq(analyticsEvent.workspaceId, ws.id),
          inArray(analyticsEvent.eventType, [
            "collection_view",
            "collection_step_view",
            "collection_step_complete",
            "collection_submit",
            "view",
          ]),
          projectIds.length > 0 ? inArray(analyticsEvent.projectId, projectIds) : undefined,
          startDate ? gte(analyticsEvent.createdAt, startDate) : undefined,
        ),
        orderBy: desc(analyticsEvent.createdAt),
      });

      // Parse and group events
      const parsedEvents = rawEvents.map((evt) => {
        let meta: Record<string, any> = {};
        if (evt.metadataJson) {
          try {
            meta = JSON.parse(evt.metadataJson);
          } catch {
            meta = {};
          }
        }
        return {
          ...evt,
          step: meta.step as string | undefined,
          variantId: (meta.variantId || meta.variant || "A") as string,
          timeSpentMs: typeof meta.timeSpentMs === "number" ? meta.timeSpentMs : 0,
        };
      });

      // Define standard funnel steps
      const FUNNEL_STEPS = [
        { id: "rating", name: "1. Star Rating", order: 1 },
        { id: "choice", name: "2. Text or Video Choice", order: 2 },
        { id: "content", name: "3. Content & Experience", order: 3 },
        { id: "details", name: "4. Author Details", order: 4 },
        { id: "review", name: "5. Review & Consent", order: 5 },
        { id: "success", name: "6. Completed Submission", order: 6 },
      ];

      // Unique visitors per step and submissions
      const stepViewsMap = new Map<string, Set<string>>();
      const stepCompletionsMap = new Map<string, Set<string>>();
      const stepTimeSpentMap = new Map<string, number[]>();

      FUNNEL_STEPS.forEach((s) => {
        stepViewsMap.set(s.id, new Set<string>());
        stepCompletionsMap.set(s.id, new Set<string>());
        stepTimeSpentMap.set(s.id, []);
      });

      // Variant tracking
      const variantImpressions = new Map<string, Set<string>>();
      const variantSubmissions = new Map<string, Set<string>>();
      variantImpressions.set("A", new Set<string>());
      variantImpressions.set("B", new Set<string>());
      variantSubmissions.set("A", new Set<string>());
      variantSubmissions.set("B", new Set<string>());

      const uniquePageVisitors = new Set<string>();
      const uniqueSubmissions = new Set<string>();

      parsedEvents.forEach((e) => {
        const vId = e.visitorId || e.id;
        const variant = (e.variantId === "B" ? "B" : "A") as "A" | "B";

        if (e.eventType === "collection_view" || (e.eventType === "view" && e.projectId)) {
          uniquePageVisitors.add(vId);
          variantImpressions.get(variant)?.add(vId);
          // Landing step is also step 1 (rating or initial)
          stepViewsMap.get("rating")?.add(vId);
        }

        if (e.eventType === "collection_step_view") {
          uniquePageVisitors.add(vId);
          variantImpressions.get(variant)?.add(vId);
          const mappedStep =
            e.step === "text" || e.step === "video" ? "content" : e.step || "rating";
          if (stepViewsMap.has(mappedStep)) {
            stepViewsMap.get(mappedStep)?.add(vId);
          }
        }

        if (e.eventType === "collection_step_complete") {
          const mappedStep =
            e.step === "text" || e.step === "video" ? "content" : e.step || "rating";
          if (stepCompletionsMap.has(mappedStep)) {
            stepCompletionsMap.get(mappedStep)?.add(vId);
          }
          if (e.timeSpentMs > 0 && stepTimeSpentMap.has(mappedStep)) {
            stepTimeSpentMap.get(mappedStep)?.push(e.timeSpentMs);
          }
        }

        if (e.eventType === "collection_submit") {
          uniqueSubmissions.add(vId);
          stepCompletionsMap.get("review")?.add(vId);
          stepViewsMap.get("success")?.add(vId);
          stepCompletionsMap.get("success")?.add(vId);
          variantSubmissions.get(variant)?.add(vId);
        }
      });

      // Total counts
      const totalViews = Math.max(uniquePageVisitors.size, stepViewsMap.get("rating")?.size || 0);
      const totalSubmissions = Math.max(
        uniqueSubmissions.size,
        stepCompletionsMap.get("success")?.size || 0,
      );
      const submissionRate = totalViews > 0 ? (totalSubmissions / totalViews) * 100 : 0;

      // Step analytics aggregation
      const stepsAnalytics = FUNNEL_STEPS.map((s, index) => {
        const rawViews = stepViewsMap.get(s.id)?.size || 0;
        const views = index === 0 ? Math.max(rawViews, totalViews) : rawViews;
        const nextStepId =
          index < FUNNEL_STEPS.length - 1 ? FUNNEL_STEPS[index + 1]?.id : undefined;
        const completions =
          s.id === "success"
            ? totalSubmissions
            : Math.max(
                stepCompletionsMap.get(s.id)?.size || 0,
                // If they reached next step, they must have completed this step
                nextStepId ? stepViewsMap.get(nextStepId)?.size || 0 : 0,
              );

        const dropOffCount = Math.max(0, views - completions);
        const dropOffRate = views > 0 ? (dropOffCount / views) * 100 : 0;
        const completionRate = views > 0 ? (completions / views) * 100 : 0;

        const timeSpents = stepTimeSpentMap.get(s.id) || [];
        const avgTimeSpentMs =
          timeSpents.length > 0
            ? Math.round(timeSpents.reduce((a, b) => a + b, 0) / timeSpents.length)
            : 0;

        return {
          id: s.id,
          name: s.name,
          order: s.order,
          views,
          completions,
          dropOffCount,
          dropOffRate: Number(dropOffRate.toFixed(1)),
          completionRate: Number(completionRate.toFixed(1)),
          avgTimeSpentSec: Number((avgTimeSpentMs / 1000).toFixed(1)),
        };
      });

      // Drop-off Heatmap generation (Friction index & abandonment profile per step)
      const dropOffHeatmap = stepsAnalytics.map((step) => {
        // Friction score 0-100 based on drop-off rate and relative bounce severity
        let frictionLevel: "low" | "moderate" | "high" | "critical" = "low";
        if (step.dropOffRate >= 45) frictionLevel = "critical";
        else if (step.dropOffRate >= 25) frictionLevel = "high";
        else if (step.dropOffRate >= 10) frictionLevel = "moderate";

        return {
          stepId: step.id,
          stepName: step.name,
          views: step.views,
          dropOffCount: step.dropOffCount,
          dropOffRate: step.dropOffRate,
          frictionLevel,
          avgTimeSpentSec: step.avgTimeSpentSec,
        };
      });

      // A/B Test Configuration from Project Settings
      const primaryProject = targetProjects[0];
      let abConfig: {
        enabled: boolean;
        variantA: { headline: string; ctaText: string; subheading?: string };
        variantB: { headline: string; ctaText: string; subheading?: string };
      } = {
        enabled: false,
        variantA: {
          headline: "Share your experience",
          ctaText: "Submit Testimonial",
          subheading: "We value your feedback",
        },
        variantB: {
          headline: "Tell us what you loved",
          ctaText: "Send My Review",
          subheading: "Help others discover our service",
        },
      };

      if (primaryProject?.collectionSettingsJson) {
        try {
          const parsedSettings = JSON.parse(primaryProject.collectionSettingsJson);
          if (parsedSettings.abTesting) {
            abConfig = {
              enabled: Boolean(parsedSettings.abTesting.enabled),
              variantA: parsedSettings.abTesting.variants?.find((v: any) => v.id === "A") || {
                headline: parsedSettings.pageContent?.headline || "Share your experience",
                ctaText: "Submit Testimonial",
                subheading: parsedSettings.pageContent?.subheading || "We value your feedback",
              },
              variantB: parsedSettings.abTesting.variants?.find((v: any) => v.id === "B") || {
                headline: "Tell us what you loved",
                ctaText: "Send My Review",
                subheading: "Help others discover our service",
              },
            };
          } else {
            // Default variant A to project's current page content
            if (parsedSettings.pageContent?.headline) {
              abConfig.variantA.headline = parsedSettings.pageContent.headline;
            }
            if (parsedSettings.pageContent?.subheading) {
              abConfig.variantA.subheading = parsedSettings.pageContent.subheading;
            }
          }
        } catch {}
      }

      // A/B Test calculations
      const viewsA = variantImpressions.get("A")?.size || 0;
      const viewsB = variantImpressions.get("B")?.size || 0;
      const convA = variantSubmissions.get("A")?.size || 0;
      const convB = variantSubmissions.get("B")?.size || 0;

      const rateA = viewsA > 0 ? (convA / viewsA) * 100 : 0;
      const rateB = viewsB > 0 ? (convB / viewsB) * 100 : 0;
      const uplift = rateA > 0 ? ((rateB - rateA) / rateA) * 100 : rateB > 0 ? 100 : 0;

      // Two-proportion Z-score calculation
      let zScore = 0;
      let confidenceScore = 0;
      let winner: "A" | "B" | "tie" | "insufficient_data" = "insufficient_data";

      if (viewsA >= 10 && viewsB >= 10) {
        const pA = convA / viewsA;
        const pB = convB / viewsB;
        const pPool = (convA + convB) / (viewsA + viewsB);
        const se = Math.sqrt(pPool * (1 - pPool) * (1 / viewsA + 1 / viewsB));
        if (se > 0) {
          zScore = (pB - pA) / se;
          // Approximate error function for normal CDF
          const t = 1.0 / (1.0 + 0.2316419 * Math.abs(zScore));
          const d = 0.3989423 * Math.exp((-zScore * zScore) / 2);
          const prob =
            1.0 -
            d *
              t *
              (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
          confidenceScore = Number((prob * 100).toFixed(1));

          if (confidenceScore >= 95) {
            winner = rateB > rateA ? "B" : "A";
          } else if (confidenceScore >= 80) {
            winner = rateB > rateA ? "B" : "A";
          } else {
            winner = "tie";
          }
        }
      }

      const abTestResults = {
        enabled: abConfig.enabled,
        variants: [
          {
            id: "A",
            name: "Variant A (Control)",
            headline: abConfig.variantA.headline,
            subheading: abConfig.variantA.subheading,
            ctaText: abConfig.variantA.ctaText,
            impressions: viewsA,
            submissions: convA,
            conversionRate: Number(rateA.toFixed(1)),
          },
          {
            id: "B",
            name: "Variant B (Challenger)",
            headline: abConfig.variantB.headline,
            subheading: abConfig.variantB.subheading,
            ctaText: abConfig.variantB.ctaText,
            impressions: viewsB,
            submissions: convB,
            conversionRate: Number(rateB.toFixed(1)),
          },
        ],
        uplift: Number(uplift.toFixed(1)),
        confidenceScore,
        winner,
      };

      return {
        overall: {
          totalViews,
          totalSubmissions,
          submissionRate: Number(submissionRate.toFixed(1)),
          averageCompletionTimeSec: Number(
            (stepsAnalytics.reduce((acc, curr) => acc + curr.avgTimeSpentSec, 0) || 45).toFixed(1),
          ),
        },
        steps: stepsAnalytics,
        dropOffHeatmap,
        abTest: abTestResults,
      };
    }),
});
