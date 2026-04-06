import { initTRPC, TRPCError } from "@trpc/server";
import { trace, SpanStatusCode } from "@opentelemetry/api";

import { checkRateLimit } from "./rateLimit";
import type { Context } from "./context";

export const t = initTRPC.context<Context>().create();

export const router = t.router;

const tracer = trace.getTracer("my-better-t-app-api");

export const tracingMiddleware = t.middleware(async ({ path, type, next }) => {
  return tracer.startActiveSpan(`tRPC ${type} ${path}`, async (span) => {
    try {
      const result = await next();
      if (!result.ok) {
        span.setStatus({
          code: SpanStatusCode.ERROR,
          message: result.error.message,
        });
      } else {
        span.setStatus({ code: SpanStatusCode.OK });
      }
      return result;
    } catch (error) {
      span.setStatus({
        code: SpanStatusCode.ERROR,
        message: error instanceof Error ? error.message : String(error),
      });
      throw error;
    } finally {
      span.end();
    }
  });
});

export const ratelimitMiddleware = t.middleware(async ({ ctx, next }) => {
  const ip = ctx.req.headers.get("x-forwarded-for") || "127.0.0.1";

  if (!checkRateLimit(ip)) {
    throw new TRPCError({
      code: "TOO_MANY_REQUESTS",
      message: "Rate limit exceeded. Please try again later.",
    });
  }

  return next();
});

export const csrfMiddleware = t.middleware(async ({ ctx, next, type }) => {
  if (type === "mutation") {
    const csrfToken = ctx.req.headers.get("x-trpc-csrf");
    const cookieToken = ctx.req.cookies.get("csrf-token")?.value;

    if (!csrfToken || csrfToken !== cookieToken) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "CSRF token validation failed",
      });
    }
  }

  return next();
});

export const publicProcedure = t.procedure
  .use(tracingMiddleware)
  .use(ratelimitMiddleware)
  .use(csrfMiddleware);

export const protectedProcedure = t.procedure
  .use(tracingMiddleware)
  .use(ratelimitMiddleware)
  .use(csrfMiddleware)
  .use(({ ctx, next }) => {
    if (!ctx.session) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Authentication required",
        cause: "No session",
      });
    }
    return next({
      ctx: {
        ...ctx,
        session: ctx.session,
      },
    });
  });
