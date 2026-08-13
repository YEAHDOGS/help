import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { integrations } from "@/lib/integrations";

let limiter: Ratelimit | null | undefined;

/**
 * Upstash-backed sliding-window rate limiter (10 requests / 10s per IP).
 * No-ops (always allows) until Upstash env vars are set.
 */
export async function checkRateLimit(identifier: string): Promise<boolean> {
  if (limiter === undefined) {
    limiter = integrations.upstash()
      ? new Ratelimit({
          redis: Redis.fromEnv(),
          limiter: Ratelimit.slidingWindow(10, "10 s"),
          prefix: "dogs-help",
        })
      : null;
  }
  if (!limiter) return true;
  const { success } = await limiter.limit(identifier);
  return success;
}
