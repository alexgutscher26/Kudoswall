import { protectedProcedure, publicAnalyticsProcedure, router } from "../index";
import {
  workspace,
  project,
  testimonial,
  widget,
  analyticsEvent,
} from "@my-better-t-app/db/schema";
import { eq, and, desc, count, sql, gte, inArray } from "drizzle-orm";
import { z } from "zod";
import { subDays, startOfDay, eachDayOfInterval, format, differenceInDays } from "date-fns";

const timeframeSchema = z.enum(["7d", "30d", "90d", "all"]).optional();

const getTimefilter = (timeframe?: string) => {
  if (!timeframe || timeframe === "all") return null;
  const days = parseInt(timeframe);
  if (isNaN(days)) return null;
  return subDays(new Date(), days);
};

export const analyticsRouter = router({
  trackEvent: publicAnalyticsProcedure
    .input(
      z.object({
        workspaceId: z.string(),
        projectId: z.string().optional(),
        widgetId: z.string().optional(),
        eventType: z.enum(["view", "click"]),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { db } = ctx;
      const id = crypto.randomUUID();
      await db.insert(analyticsEvent).values({
        id: id,
        workspaceId: input.workspaceId,
        projectId: input.projectId,
        widgetId: input.widgetId,
        eventType: input.eventType,
      });
      return { success: true };
    }),

  getOverview: protectedProcedure
    .input(z.object({ timeframe: timeframeSchema }))
    .query(async ({ ctx, input }) => {
      const { db, session } = ctx;
      const ws = await db.query.workspace.findFirst({
        where: eq(workspace.ownerId, session.user.id),
      });
      if (!ws) throw new Error("No workspace found");

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

      return {
        totalViews: views.toLocaleString(),
        totalTestimonials: submissions.toLocaleString(),
        newTestimonials: submissions,
        conversionRate,
        viewsChange,
        submissionsChange,
        conversionChange,
        viewsRaw: views,
        submissionsRaw: submissions,
      };
    }),

  getChartData: protectedProcedure
    .input(z.object({ timeframe: timeframeSchema }))
    .query(async ({ ctx, input }) => {
      const { db, session } = ctx;
      const ws = await db.query.workspace.findFirst({
        where: eq(workspace.ownerId, session.user.id),
      });
      if (!ws) throw new Error("No workspace found");

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
    .input(z.object({ timeframe: timeframeSchema }))
    .query(async ({ ctx, input }) => {
      const { db, session } = ctx;
      const start = getTimefilter(input.timeframe);
      const ws = await db.query.workspace.findFirst({
        where: eq(workspace.ownerId, session.user.id),
      });
      if (!ws) throw new Error("No workspace found");

      const widgets = await db.query.widget.findMany({
        where: eq(widget.workspaceId, ws.id),
      });

      const performance = await Promise.all(
        widgets.map(async (w) => {
          const viewsRes = await db
            .select({ value: count() })
            .from(analyticsEvent)
            .where(
              and(
                eq(analyticsEvent.widgetId, w.id),
                eq(analyticsEvent.eventType, "view"),
                start ? gte(analyticsEvent.createdAt, start) : undefined,
              ),
            );
          const views = viewsRes[0];

          const clicksRes = await db
            .select({ value: count() })
            .from(analyticsEvent)
            .where(
              and(
                eq(analyticsEvent.widgetId, w.id),
                eq(analyticsEvent.eventType, "click"),
                start ? gte(analyticsEvent.createdAt, start) : undefined,
              ),
            );
          const clicksValue = clicksRes[0];

          const v = Number(views?.value || 0);
          const c = Number(clicksValue?.value || 0);
          const ctrVal = v > 0 ? ((c / v) * 100).toFixed(1) + "%" : "0%";

          return {
            name: w.name,
            views: v,
            clicks: c,
            ctr: ctrVal,
          };
        }),
      );

      return performance;
    }),

  getExportData: protectedProcedure
    .input(z.object({ timeframe: timeframeSchema }))
    .query(async ({ ctx, input }) => {
      const { db, session } = ctx;
      const start = getTimefilter(input.timeframe);
      const ws = await db.query.workspace.findFirst({
        where: eq(workspace.ownerId, session.user.id),
      });
      if (!ws) throw new Error("No workspace found");

      const widgets = await db.query.widget.findMany({
        where: eq(widget.workspaceId, ws.id),
      });

      const performance = await Promise.all(
        widgets.map(async (w) => {
          const viewsRes = await db
            .select({ value: count() })
            .from(analyticsEvent)
            .where(
              and(
                eq(analyticsEvent.widgetId, w.id),
                eq(analyticsEvent.eventType, "view"),
                start ? gte(analyticsEvent.createdAt, start) : undefined,
              ),
            );
          const views = viewsRes[0];

          const clicksRes = await db
            .select({ value: count() })
            .from(analyticsEvent)
            .where(
              and(
                eq(analyticsEvent.widgetId, w.id),
                eq(analyticsEvent.eventType, "click"),
                start ? gte(analyticsEvent.createdAt, start) : undefined,
              ),
            );
          const clicksValue = clicksRes[0];

          const v = Number(views?.value || 0);
          const c = Number(clicksValue?.value || 0);
          const ctrVal = v > 0 ? ((c / v) * 100).toFixed(1) + "%" : "0%";

          return {
            "Widget Name": w.name,
            Views: v,
            Clicks: c,
            CTR: ctrVal,
            "Created At": format(w.createdAt, "yyyy-MM-dd HH:mm:ss"),
          };
        }),
      );

      return performance;
    }),

  getTopTestimonials: protectedProcedure.query(async ({ ctx }) => {
    const { db, session } = ctx;
    const ws = await db.query.workspace.findFirst({
      where: eq(workspace.ownerId, session.user.id),
    });
    if (!ws) throw new Error("No workspace found");

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
});
