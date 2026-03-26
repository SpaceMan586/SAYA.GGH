import "server-only";

type RateLimitBucket = {
  count: number;
  resetAt: number;
};

type RateLimitStore = Map<string, RateLimitBucket>;

const globalForRateLimit = globalThis as typeof globalThis & {
  __serverRateLimitStore?: RateLimitStore;
};

const rateLimitStore: RateLimitStore =
  globalForRateLimit.__serverRateLimitStore ?? new Map<string, RateLimitBucket>();

if (!globalForRateLimit.__serverRateLimitStore) {
  globalForRateLimit.__serverRateLimitStore = rateLimitStore;
}

export const checkServerRateLimit = ({
  namespace,
  key,
  windowMs,
  max,
}: {
  namespace: string;
  key: string;
  windowMs: number;
  max: number;
}) => {
  const now = Date.now();
  const storeKey = `${namespace}:${key}`;
  const current = rateLimitStore.get(storeKey);

  if (!current || now > current.resetAt) {
    rateLimitStore.set(storeKey, { count: 1, resetAt: now + windowMs });
    return { allowed: true, retryAfterSec: 0 };
  }

  if (current.count >= max) {
    const retryAfterSec = Math.max(1, Math.ceil((current.resetAt - now) / 1000));
    return { allowed: false, retryAfterSec };
  }

  current.count += 1;
  rateLimitStore.set(storeKey, current);
  return { allowed: true, retryAfterSec: 0 };
};
