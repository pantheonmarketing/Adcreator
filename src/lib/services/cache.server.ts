"server-only";

import { cachified as originalCachified, CachifiedOptions, verboseReporter } from "@epic-web/cachified";
import { createClient } from "redis";
import { redisCacheAdapter } from "cachified-redis-adapter";

const CACHE_ENABLED = false;
const CACHE_LOGGING_ENABLED = true;

if (!process.env.REDIS_URL && CACHE_ENABLED) {
  throw new Error("REDIS_URL is required when CACHE_ENABLED is true");
}

const redis = createClient({
  url: process.env.REDIS_URL,
});

if (CACHE_ENABLED) {
  redis.on("error", function (err: Error) {
    throw err;
  });
  await redis.connect();
  await redis.set("rock", "stack");
}

export const cache = redisCacheAdapter(redis);

export async function cachified<Value>(
  options: Omit<CachifiedOptions<Value>, "cache"> & {
    disabled?: boolean;
  }
): Promise<Value> {
  if (!CACHE_ENABLED || options.disabled) {
    // @ts-ignore
    return options.getFreshValue(options);
  }
  return originalCachified(
    {
      ...options,
      cache,
    },
    CACHE_LOGGING_ENABLED ? verboseReporter() : undefined
  );
}

export async function clearCacheKey(key: string): Promise<void> {
  if (!CACHE_ENABLED) {
    return;
  }
  cache.delete(key);
}

export type CachedValue = {
  key: string;
  value: any;
  sizeMb: number;
  createdAt: Date;
  createdTime: number;
};

export async function getCachedValues() {
  if (!CACHE_ENABLED) {
    return [];
  }
  const allKeys = await redis.keys("*");
  console.log("allKeys", allKeys);
  const cachedValues: CachedValue[] = [];
  for (const key of allKeys) {
    if (cachedValues.find((x) => x.key === key)) {
      continue;
    }
    const value = await redis.get(key);
    if (!value) {
      continue;
    }
    const sizeBytes = new TextEncoder().encode(JSON.stringify(value)).length;
    const sizeMb = sizeBytes / 1024 / 1024;
    // const createdTime = value.metadata.createdTime;
    // const createdAt = new Date(createdTime);
    // const cachedValue = { key, value: value.value, sizeMb, createdAt, createdTime };
    cachedValues.push({
      key,
      value,
      sizeMb,
      createdAt: new Date(),
      createdTime: Date.now(),
    });
  }
  return cachedValues;
}

export async function clearAllCache() {
  if (!CACHE_ENABLED) {
    return;
  }
  await redis.flushAll();
}
