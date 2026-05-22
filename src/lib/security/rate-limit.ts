type RateLimitOptions = {
  identifier: string;
  limit: number;
  windowMs: number;
};

type RateLimitRecord = {
  count: number;
  resetAt: number;
};

type RateLimitResult = {
  allowed: boolean;
  remaining: number;
  resetAt: number;
  retryAfterSeconds: number;
};

const buckets = new Map<string, RateLimitRecord>();

function cleanupExpiredBuckets(now: number) {
  for (const [key, record] of buckets.entries()) {
    if (record.resetAt <= now) {
      buckets.delete(key);
    }
  }
}

export function checkRateLimit({
  identifier,
  limit,
  windowMs,
}: RateLimitOptions): RateLimitResult {
  const now = Date.now();
  const existingRecord = buckets.get(identifier);

  cleanupExpiredBuckets(now);

  if (!existingRecord || existingRecord.resetAt <= now) {
    const resetAt = now + windowMs;

    buckets.set(identifier, {
      count: 1,
      resetAt,
    });

    return {
      allowed: true,
      remaining: limit - 1,
      resetAt,
      retryAfterSeconds: 0,
    };
  }

  const nextCount = existingRecord.count + 1;
  const retryAfterSeconds = Math.max(
    Math.ceil((existingRecord.resetAt - now) / 1000),
    1
  );

  buckets.set(identifier, {
    ...existingRecord,
    count: nextCount,
  });

  return {
    allowed: nextCount <= limit,
    remaining: Math.max(limit - nextCount, 0),
    resetAt: existingRecord.resetAt,
    retryAfterSeconds,
  };
}

export function getClientIp(headers: Headers) {
  const forwardedFor = headers.get("x-forwarded-for");
  const firstForwardedIp = forwardedFor?.split(",")[0]?.trim();

  return (
    firstForwardedIp ||
    headers.get("x-real-ip") ||
    headers.get("cf-connecting-ip") ||
    "unknown"
  );
}

export function formatRetryMessage(retryAfterSeconds: number) {
  const minutes = Math.max(Math.ceil(retryAfterSeconds / 60), 1);

  return `Terlalu banyak percobaan. Coba lagi dalam ${minutes} menit.`;
}
