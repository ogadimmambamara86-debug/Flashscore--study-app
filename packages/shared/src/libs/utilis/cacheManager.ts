
interface CacheEntry {
  data: any;
  timestamp: number;
  ttl: number;
  accessCount: number;
  lastAccessed: number;
  userId?: string;
  encrypted?: boolean;
  sensitiveData?: boolean;
}

class CacheManager {
  private static cache = new Map<string, CacheEntry>();
  private static maxSize = 1000;
  private static cleanupInterval: NodeJS.Timeout | null = null;

  static {
    // Start automatic cleanup every 5 minutes
    this.startCleanup();
  }

  static set(key: string, data: any, ttlMinutes: number = 10, options?: {
    userId?: string;
    encrypted?: boolean;
    sensitiveData?: boolean;
  }): void {
    // Implement LRU eviction if cache is full
    if (this.cache.size >= this.maxSize) {
      this.evictLRU();
    }

    // Check for sensitive data and apply encryption
    let processedData = data;
    if (options?.sensitiveData || options?.encrypted) {
      // Import SecurityUtils for encryption
      const SecurityUtils = require('./securityUtils').default;
      processedData = SecurityUtils.encryptData(JSON.stringify(data), 'cache_key_' + key);
    }

    // User-specific cache limits
    if (options?.userId) {
      const userCacheCount = Array.from(this.cache.values())
        .filter(entry => entry.userId === options.userId).length;
      
      if (userCacheCount >= 100) { // Limit per user
        this.evictUserOldest(options.userId);
      }
    }

    this.cache.set(key, {
      data: processedData,
      timestamp: Date.now(),
      ttl: ttlMinutes * 60 * 1000,
      accessCount: 0,
      lastAccessed: Date.now(),
      userId: options?.userId,
      encrypted: options?.encrypted || options?.sensitiveData,
      sensitiveData: options?.sensitiveData
    });
  }

  static get(key: string, userId?: string): any | null {
    const cached = this.cache.get(key);
    
    if (!cached) return null;
    
    // Check if expired
    if (Date.now() - cached.timestamp > cached.ttl) {
      this.cache.delete(key);
      return null;
    }

    // User access validation for sensitive data
    if (cached.sensitiveData && cached.userId && cached.userId !== userId) {
      // Log security event
      const SecurityUtils = require('./securityUtils').default;
      SecurityUtils.logSecurityEvent('unauthorized_cache_access', {
        key: key.substring(0, 20) + '...',
        requestedBy: userId,
        ownedBy: cached.userId
      });
      return null;
    }
    
    // Update access statistics
    cached.accessCount++;
    cached.lastAccessed = Date.now();
    
    // Decrypt if necessary
    if (cached.encrypted) {
      try {
        const SecurityUtils = require('./securityUtils').default;
        const decrypted = SecurityUtils.decryptData(cached.data, 'cache_key_' + key);
        return JSON.parse(decrypted);
      } catch (error) {
        console.error('Cache decryption failed:', error);
        this.cache.delete(key);
        return null;
      }
    }
    
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

  // User-specific cache management
  static evictUserOldest(userId: string): void {
    let oldestKey = '';
    let oldestTime = Date.now();
    
    for (const [key, entry] of this.cache.entries()) {
      if (entry.userId === userId && entry.lastAccessed < oldestTime) {
        oldestTime = entry.lastAccessed;
        oldestKey = key;
      }
    }
    
    if (oldestKey) {
      this.cache.delete(oldestKey);
    }
  }

  static clearUserCache(userId: string): void {
    for (const [key, entry] of this.cache.entries()) {
      if (entry.userId === userId) {
        this.cache.delete(key);
      }
    }
  }

  static getUserCacheStats(userId: string): {
    count: number;
    totalAccess: number;
    sensitiveItems: number;
  } {
    const userEntries = Array.from(this.cache.values())
      .filter(entry => entry.userId === userId);
    
    return {
      count: userEntries.length,
      totalAccess: userEntries.reduce((sum, entry) => sum + entry.accessCount, 0),
      sensitiveItems: userEntries.filter(entry => entry.sensitiveData).length
    };
  }

  // Security and privacy methods
  static sanitizeCache(): void {
    const now = Date.now();
    const maxAge = 24 * 60 * 60 * 1000; // 24 hours for sensitive data
    
    for (const [key, entry] of this.cache.entries()) {
      if (entry.sensitiveData && (now - entry.timestamp > maxAge)) {
        this.cache.delete(key);
      }
    }
  }
}

export default CacheManager;
