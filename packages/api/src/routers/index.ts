import { protectedProcedure, publicProcedure, router } from "../index";
import { dashboardRouter } from "./dashboard";
import { widgetRouter } from "./widget";
import { tagRouter } from "./tag";
import { analyticsRouter } from "./analytics";
import { teamRouter } from "./team";
import { billingRouter } from "./billing";
import { authRouter } from "./auth";
import { referralRouter } from "./referral";

export const appRouter = router({
  dashboard: dashboardRouter,
  widget: widgetRouter,
  tag: tagRouter,
  analytics: analyticsRouter,
  team: teamRouter,
  billing: billingRouter,
  auth: authRouter,
  referral: referralRouter,
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
