import { Redis } from "@upstash/redis";
import { getEnvAsync } from "@my-better-t-app/env/server";

export async function getRedis() {
  const env = await getEnvAsync();
  
  if (!env.UPSTASH_REDIS_REST_URL || !env.UPSTASH_REDIS_REST_TOKEN) {
    throw new Error("Missing Upstash Redis environment variables");
  }

  return new Redis({
    url: env.UPSTASH_REDIS_REST_URL,
    token: env.UPSTASH_REDIS_REST_TOKEN,
  });
}
