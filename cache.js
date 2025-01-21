// cache.js
class Cache {
  constructor(ttl = 3600000) {
    // 1 hour
    this.cache = new Map();
    this.ttl = ttl;
  }

  set(key, value) {
    const item = {
      value,
      timestamp: Date.now(),
    };
    this.cache.set(key, item);
    return value;
  }

  get(key) {
    const item = this.cache.get(key);
    if (!item) return null;

    // Check if the item has expired
    if (Date.now() - item.timestamp > this.ttl) {
      this.cache.delete(key);
      return null;
    }

    return item.value;
  }

  clear() {
    this.cache.clear();
  }

  // Clean up expired items periodically
  startCleanup(interval = 3600000) {
    // clean every hour
    setInterval(() => {
      const now = Date.now();
      for (const [key, item] of this.cache.entries()) {
        if (now - item.timestamp > this.ttl) {
          this.cache.delete(key);
        }
      }
    }, interval);
  }
}

// Create a singleton instance
const CACHE_TTL = 3600000; // 1 hour
const redirectsCache = new Cache(CACHE_TTL);
redirectsCache.startCleanup();

module.exports = redirectsCache;
