"server-only";

import { LRUCache } from "lru-cache";
import { cachified as originalCachified, CacheEntry, CachifiedOptions, verboseReporter } from "@epic-web/cachified";

const lru = new LRUCache<string, CacheEntry>({ max: 1000 });

// replace this with redisCacheAdapter(redis) if you need to: https://github.com/epicweb-dev/cachified#adapter-for-redis
export const cache = lru;

const CACHE_ENABLED = true;
const CACHE_LOGGING_ENABLED = false;

export async function cachified<Value>(
  options: Omit<CachifiedOptions<Value>, "cache"> & {
    disabled?: boolean;
  }
): Promise<Value> {
  if (!CACHE_ENABLED || options.disabled) {
    // @ts-ignore
    return options.getFreshValue(options);
  }
  return originalCachified({
    ...options,
    cache,
    reporter: CACHE_LOGGING_ENABLED ? verboseReporter() : undefined,
  });
}

export async function clearCacheKey(key: string): Promise<void> {
  cache.delete(key);
}

export type CachedValue = {
  key: string;
  value: any;
  sizeMb: number;
  createdAt: Date;
  createdTime: number;
};

export function getCachedValues() {
  const cachedValues: CachedValue[] = [];
  for (const key of cache.keys()) {
    if (cachedValues.find((x) => x.key === key)) {
      continue;
    }
    const value = cache.get(key);
    if (!value) {
      continue;
    }
    const sizeBytes = new TextEncoder().encode(JSON.stringify(value)).length;
    const sizeMb = sizeBytes / 1024 / 1024;
    const createdTime = value.metadata.createdTime;
    const createdAt = new Date(createdTime);
    const cachedValue = { key, value: value.value, sizeMb, createdAt, createdTime };
    cachedValues.push(cachedValue);
  }
  return cachedValues;
}
