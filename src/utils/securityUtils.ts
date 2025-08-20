
class SecurityUtils {
  // Input sanitization
  static sanitizeInput(input: string): string {
    if (!input || typeof input !== 'string') return '';
    
    return input
      .replace(/[<>"/\\&]/g, '') // Remove dangerous characters
      .trim()
      .substring(0, 1000); // Limit length
  }

  static sanitizeEmail(email: string): string {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const sanitized = this.sanitizeInput(email);
    return emailRegex.test(sanitized) ? sanitized : '';
  }

  static sanitizeUsername(username: string): string {
    const sanitized = this.sanitizeInput(username);
    // Only allow alphanumeric, underscore, hyphen
    return sanitized.replace(/[^a-zA-Z0-9_-]/g, '').substring(0, 30);
  }

  // Rate limiting
  private static rateLimitStore: Map<string, { count: number; resetTime: number }> = new Map();

  static checkRateLimit(identifier: string, maxRequests: number = 10, windowMs: number = 60000): boolean {
    const now = Date.now();
    const record = this.rateLimitStore.get(identifier);

    if (!record || now > record.resetTime) {
      this.rateLimitStore.set(identifier, { count: 1, resetTime: now + windowMs });
      return true;
    }

    if (record.count >= maxRequests) {
      return false;
    }

    record.count++;
    return true;
  }

  // Session management
  static generateSecureToken(): string {
    const array = new Uint8Array(32);
    if (typeof window !== 'undefined' && window.crypto) {
      window.crypto.getRandomValues(array);
    } else {
      // Fallback for server-side
      for (let i = 0; i < array.length; i++) {
        array[i] = Math.floor(Math.random() * 256);
      }
    }
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  }

  static validateSession(token: string): boolean {
    if (!token || typeof token !== 'string') return false;
    return token.length === 64 && /^[a-f0-9]+$/.test(token);
  }

  // XSS Protection
  static escapeHtml(unsafe: string): string {
    return unsafe
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  // CSRF Protection
  static generateCSRFToken(): string {
    return this.generateSecureToken();
  }

  static validateCSRFToken(token: string, storedToken: string): boolean {
    return token === storedToken && token.length === 64;
  }

  // Data encryption for sensitive storage
  static encryptData(data: string, key: string): string {
    // Simple XOR encryption for demo (use proper encryption in production)
    let result = '';
    for (let i = 0; i < data.length; i++) {
      result += String.fromCharCode(data.charCodeAt(i) ^ key.charCodeAt(i % key.length));
    }
    return btoa(result);
  }

  static decryptData(encryptedData: string, key: string): string {
    try {
      const data = atob(encryptedData);
      let result = '';
      for (let i = 0; i < data.length; i++) {
        result += String.fromCharCode(data.charCodeAt(i) ^ key.charCodeAt(i % key.length));
      }
      return result;
    } catch {
      return '';
    }
  }

  // Security audit logging
  static logSecurityEvent(event: string, details: any): void {
    const logEntry = {
      timestamp: new Date().toISOString(),
      event,
      details,
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'server',
      ip: 'masked' // In production, get real IP from headers
    };

    // Store in localStorage for demo (use proper logging service in production)
    if (typeof localStorage !== 'undefined') {
      const logs = JSON.parse(localStorage.getItem('security_logs') || '[]');
      logs.unshift(logEntry);
      logs.splice(100); // Keep only last 100 logs
      localStorage.setItem('security_logs', JSON.stringify(logs));
    }

    console.warn('Security Event:', logEntry);
  }
}

export default SecurityUtils;
