import { protectedProcedure, publicProcedure, router } from "../index";
import { dashboardRouter } from "./dashboard";

export const appRouter = router({
  dashboard: dashboardRouter,
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
