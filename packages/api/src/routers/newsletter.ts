import { z } from "zod";
import { publicProcedure, router } from "../index";
import { env } from "@my-better-t-app/env/server";
import { LoopsService } from "@my-better-t-app/email";
import { TRPCError } from "@trpc/server";

export const newsletterRouter = router({
  subscribe: publicProcedure
    .input(z.object({ email: z.string().email() }))
    .mutation(async ({ input }) => {
      try {
        const apiKey = env.LOOPS_API_KEY;
        if (!apiKey) {
          console.warn(
            "[Newsletter Router] LOOPS_API_KEY is not defined. Simulating subscription.",
          );
          return {
            success: true,
            message: "Subscription simulated successfully (no API key configured)",
          };
        }

        const loops = new LoopsService(apiKey);
        await loops.createContact({
          email: input.email,
          userGroup: "Newsletter Subscribers",
          source: "Newsletter Form",
        });

        return {
          success: true,
          message: "Successfully subscribed to the newsletter!",
        };
      } catch (error) {
        console.error("[Newsletter Router] Error subscribing:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to process newsletter subscription. Please try again.",
        });
      }
    }),
});
