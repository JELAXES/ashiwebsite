/**
 * In-memory, per-instance rate limiting. This is a structural placeholder — it resets on
 * redeploy and does not coordinate across serverless instances. Swap for a shared store
 * (e.g. Upstash Redis) before relying on this in a multi-instance production deployment.
 */
const DEFAULT_WINDOW_MS = 60_000;
const DEFAULT_MAX_REQUESTS = 12;

const buckets = new Map<string, { count: number; resetAt: number }>();
let lastSweep = 0;

/** Drop expired buckets so the map can't grow without bound under many distinct keys. */
function sweep(now: number) {
  if (now - lastSweep < DEFAULT_WINDOW_MS) return;
  lastSweep = now;
  for (const [key, bucket] of buckets) {
    if (now > bucket.resetAt) buckets.delete(key);
  }
}

export function checkRateLimit(
  key: string,
  max: number = DEFAULT_MAX_REQUESTS,
  windowMs: number = DEFAULT_WINDOW_MS,
): boolean {
  const now = Date.now();
  sweep(now);
  const bucket = buckets.get(key);

  if (!bucket || now > bucket.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }

  if (bucket.count >= max) {
    return false;
  }

  bucket.count += 1;
  return true;
}
