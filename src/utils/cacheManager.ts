
interface CacheEntry {
  data: any;
  timestamp: number;
  ttl: number;
  accessCount: number;
  lastAccessed: number;
}

class CacheManager {
  private static cache = new Map<string, CacheEntry>();
  private static maxSize = 1000;
  private static cleanupInterval: NodeJS.Timeout | null = null;

  static {
    // Start automatic cleanup every 5 minutes
    this.startCleanup();
  }

  static set(key: string, data: any, ttlMinutes: number = 10): void {
    // Implement LRU eviction if cache is full
    if (this.cache.size >= this.maxSize) {
      this.evictLRU();
    }

    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl: ttlMinutes * 60 * 1000,
      accessCount: 0,
      lastAccessed: Date.now()
    });
  }

  static get(key: string): any | null {
    const cached = this.cache.get(key);
    
    if (!cached) return null;
    
    // Check if expired
    if (Date.now() - cached.timestamp > cached.ttl) {
      this.cache.delete(key);
      return null;
    }
    
    // Update access statistics
    cached.accessCount++;
    cached.lastAccessed = Date.now();
    
    return cached.data;
  }

  // LRU eviction - remove least recently used items
  private static evictLRU(): void {
    let oldestKey = '';
    let oldestTime = Date.now();
    
    for (const [key, entry] of this.cache.entries()) {
      if (entry.lastAccessed < oldestTime) {
        oldestTime = entry.lastAccessed;
        oldestKey = key;
      }
    }
    
    if (oldestKey) {
      this.cache.delete(oldestKey);
    }
  }

  // Background cleanup of expired entries
  private static startCleanup(): void {
    this.cleanupInterval = setInterval(() => {
      const now = Date.now();
      for (const [key, entry] of this.cache.entries()) {
        if (now - entry.timestamp > entry.ttl) {
          this.cache.delete(key);
        }
      }
    }, 5 * 60 * 1000); // Every 5 minutes
  }

  static clear(): void {
    this.cache.clear();
  }

  static getStats(): { 
    size: number; 
    keys: string[];
    hitRate: number;
    memoryUsage: string;
  } {
    const totalAccess = Array.from(this.cache.values())
      .reduce((sum, entry) => sum + entry.accessCount, 0);
    
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys()),
      hitRate: totalAccess > 0 ? (this.cache.size / totalAccess) * 100 : 0,
      memoryUsage: `${(this.cache.size * 0.1).toFixed(2)} KB (est.)`
    };
  }

  static prefetch(keys: string[], fetchFunction: (key: string) => Promise<any>): void {
    keys.forEach(async (key) => {
      if (!this.get(key)) {
        try {
          const data = await fetchFunction(key);
          this.set(key, data, 15); // 15 minute TTL for prefetched data
        } catch (error) {
          console.warn(`Prefetch failed for key ${key}:`, error);
        }
      }
    });
  }
}

export default CacheManager;
