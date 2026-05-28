import { env } from "./env.js";

let redisClient = null;
let redisReady = false;
const memStore = new Map();

export async function initCache() {
  if (!env.redisUrl) return { mode: "memory", ready: true };

  try {
    const { default: Redis } = await import("ioredis");
    redisClient = new Redis(env.redisUrl, { maxRetriesPerRequest: 2, lazyConnect: true });
    await redisClient.connect();
    redisReady = true;
    return { mode: "redis", ready: true };
  } catch (error) {
    console.warn("[CACHE] Redis unavailable, falling back to memory cache", { message: error.message });
    redisClient = null;
    redisReady = false;
    return { mode: "memory", ready: true };
  }
}

export async function cacheGet(key) {
  if (redisClient && redisReady) {
    const value = await redisClient.get(key);
    return value ? JSON.parse(value) : null;
  }

  const entry = memStore.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    memStore.delete(key);
    return null;
  }
  return entry.value;
}

export async function cacheSet(key, value, ttlSeconds = 30) {
  if (redisClient && redisReady) {
    await redisClient.set(key, JSON.stringify(value), "EX", ttlSeconds);
    return;
  }

  memStore.set(key, { value, expiresAt: Date.now() + ttlSeconds * 1000 });
}

export function getCacheStats() {
  return {
    mode: redisClient && redisReady ? "redis" : "memory",
    redisReady,
    memoryKeys: memStore.size
  };
}

export async function closeCache() {
  if (redisClient) {
    await redisClient.quit().catch(() => null);
  }
}
