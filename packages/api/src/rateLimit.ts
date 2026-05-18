import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { env } from "@my-better-t-app/env/server";

let ratelimit: Ratelimit | null = null;

if (env.UPSTASH_REDIS_REST_URL && env.UPSTASH_REDIS_REST_TOKEN) {
  ratelimit = new Ratelimit({
    redis: new Redis({
      url: env.UPSTASH_REDIS_REST_URL,
      token: env.UPSTASH_REDIS_REST_TOKEN,
    }),
    limiter: Ratelimit.slidingWindow(100, "1 m"),
    analytics: true,
    prefix: "@my-better-t-app/ratelimit",
  });
}

const memoryRateLimit = new Map<string, { count: number; resetTime: number }>();

/**
 * Rate limiter to protect API endpoints from abuse.
 * Uses Upstash Redis in production if configured, otherwise falls back to in-memory.
 */
export async function checkRateLimit(ip: string, limit = 100) {
  if (ratelimit) {
    try {
      const { success } = await ratelimit.limit(ip);
      return success;
    } catch (error) {
      console.error("Upstash Rate Limit Error:", error);
      // Fallback to memory on Redis failure to ensure availability
    }
  }

  const now = Date.now();
  const windowMs = 60 * 1000; // 1 minute window
  const record = memoryRateLimit.get(ip) || { count: 0, resetTime: now + windowMs };

  if (now > record.resetTime) {
    record.count = 1;
    record.resetTime = now + windowMs;
  } else {
    record.count++;
  }

  memoryRateLimit.set(ip, record);
  return record.count <= limit;
}
