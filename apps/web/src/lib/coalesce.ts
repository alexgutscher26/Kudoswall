import { getRedis } from "./redis";

interface CoalesceOptions<T> {
  key: string;
  fetcher: () => Promise<T>;
  kv: KVNamespace | undefined;
  ttl?: number; // In seconds
  lockTimeout?: number; // In milliseconds
  pollInterval?: number; // In milliseconds
  maxWait?: number; // In milliseconds
}

export interface CoalesceResult<T> {
  data: T;
  source: "kv" | "lock" | "origin" | "fallback";
}

/**
 * withCoalescing
 * 
 * Prevents cache stampedes by ensuring only one request fetches data 
 * from the origin (DB) for a given key. Other simultaneous requests 
 * wait for the first one to populate the cache.
 */
export async function withCoalescing<T>({
  key,
  fetcher,
  kv,
  ttl = 3600,
  lockTimeout = 10000,
  pollInterval = 200,
  maxWait = 3000,
}: CoalesceOptions<T>): Promise<CoalesceResult<T>> {
  // 1. Try KV lookup first (fastest)
  if (kv) {
    const cached = await kv.get(key, "json");
    if (cached) return { data: cached as T, source: "kv" };
  }

  const redis = await getRedis();
  const lockKey = `lock:${key}`;

  // 2. Try to acquire lock
  const lock = await redis.set(lockKey, "locked", { nx: true, px: lockTimeout });

  if (lock === "OK") {
    try {
      // We are the leader! Fetch from origin.
      const data = await fetcher();

      // Save to KV for everyone else
      if (kv) {
        await kv.put(key, JSON.stringify(data), {
          expirationTtl: ttl,
        });
      }

      return { data, source: "origin" };
    } finally {
      // Release lock
      await redis.del(lockKey);
    }
  }

  // 3. Someone else is fetching. Wait and poll KV.
  const start = Date.now();
  while (Date.now() - start < maxWait) {
    await new Promise((resolve) => setTimeout(resolve, pollInterval));
    
    if (kv) {
      const cached = await kv.get(key, "json");
      if (cached) return { data: cached as T, source: "lock" };
    }
  }

  // 4. Fallback: If we waited too long, just fetch it anyway to avoid failure.
  console.warn(`Coalesce timeout for key: ${key}, falling back to fetcher.`);
  return { data: await fetcher(), source: "fallback" };
}

