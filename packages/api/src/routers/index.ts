import { protectedProcedure, publicProcedure, router } from "../index";
import { dashboardRouter } from "./dashboard";
import { widgetRouter } from "./widget";
import { tagRouter } from "./tag";

export const appRouter = router({
  dashboard: dashboardRouter,
  widget: widgetRouter,
  tag: tagRouter,
  healthCheck: publicProcedure.query(() => {
    return "OK";
  }),
  privateData: protectedProcedure.query(({ ctx }) => {
    return {
      message: "This is private",
      user: ctx.session.user,
    };
  }),
});
export type AppRouter = typeof appRouter;
