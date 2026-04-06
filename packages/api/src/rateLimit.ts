const rateLimit = new Map<string, { count: number; resetTime: number }>();

/**
 * Simple in-memory rate limiter to protect API endpoints from abuse.
 * For production with multiple instances, consider Upstash Redis.
 */
export function checkRateLimit(ip: string, limit = 100) {
  const now = Date.now();
  const windowMs = 60 * 1000; // 1 minute window
  const record = rateLimit.get(ip) || { count: 0, resetTime: now + windowMs };

  if (now > record.resetTime) {
    record.count = 1;
    record.resetTime = now + windowMs;
  } else {
    record.count++;
  }

  rateLimit.set(ip, record);
  return record.count <= limit;
}
