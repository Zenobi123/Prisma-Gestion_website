interface SecurityEvent {
  type: 'suspicious_activity' | 'failed_login' | 'rate_limit' | 'injection_attempt' | 'xss_attempt';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  ip?: string;
  userAgent?: string;
  url?: string;
  timestamp: string;
  blocked: boolean;
}

interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
}

interface SecurityConfig {
  rateLimits: {
    login: RateLimitConfig;
    api: RateLimitConfig;
    contact: RateLimitConfig;
  };
  blockedIPs: string[];
  suspiciousPatterns: RegExp[];
  maxFailedLogins: number;
  lockoutDuration: number;
}

interface BehaviorPattern {
  sessionId: string;
  action: string;
  timestamp: number;
  userId?: string;
  metadata?: Record<string, any>;
  riskScore: number;
}

export class IntrusionDetectionService {
  private static instance: IntrusionDetectionService;
  private config: SecurityConfig;
  private requestCounts: Map<string, { count: number; firstRequest: number }> = new Map();
  private failedLogins: Map<string, { count: number; lastAttempt: number }> = new Map();
  private blockedIPs: Set<string> = new Set();
  private blockedSessions: Set<string> = new Set();
  private behaviorPatterns: Map<string, BehaviorPattern[]> = new Map();

  private constructor() {
    this.config = {
      rateLimits: {
        login: { windowMs: 15 * 60 * 1000, maxRequests: 5 }, // 5 attempts per 15 minutes
        api: { windowMs: 60 * 1000, maxRequests: 100 }, // 100 requests per minute
        contact: { windowMs: 60 * 60 * 1000, maxRequests: 3 } // 3 contact forms per hour
      },
      blockedIPs: [],
      suspiciousPatterns: [
        /(\<script\>|\<\/script\>)/gi, // XSS patterns
        /(union|select|insert|delete|drop|create|alter|exec|execute)/gi, // SQL injection
        /(\.\.\/|\.\.\\)/g, // Path traversal
        /(<iframe|<object|<embed|<link|<meta)/gi, // HTML injection
      ],
      maxFailedLogins: 5,
      lockoutDuration: 30 * 60 * 1000 // 30 minutes
    };

    this.loadBlockedIPs();
  }

  static getInstance(): IntrusionDetectionService {
    if (!IntrusionDetectionService.instance) {
      IntrusionDetectionService.instance = new IntrusionDetectionService();
    }
    return IntrusionDetectionService.instance;
  }

  private loadBlockedIPs(): void {
    try {
      const stored = localStorage.getItem('blocked_ips');
      if (stored) {
        const ips = JSON.parse(stored);
        this.blockedIPs = new Set(ips);
      }
    } catch (error) {
      console.error('Error loading blocked IPs:', error);
    }
  }

  private saveBlockedIPs(): void {
    try {
      localStorage.setItem('blocked_ips', JSON.stringify([...this.blockedIPs]));
    } catch (error) {
      console.error('Error saving blocked IPs:', error);
    }
  }

  checkRateLimit(ip: string, type: keyof SecurityConfig['rateLimits']): boolean {
    const key = `${ip}:${type}`;
    const now = Date.now();
    const config = this.config.rateLimits[type];
    
    const existing = this.requestCounts.get(key);
    
    if (!existing) {
      this.requestCounts.set(key, { count: 1, firstRequest: now });
      return true;
    }

    // Reset if window has passed
    if (now - existing.firstRequest > config.windowMs) {
      this.requestCounts.set(key, { count: 1, firstRequest: now });
      return true;
    }

    // Check if limit exceeded
    if (existing.count >= config.maxRequests) {
      IntrusionDetectionService.logSecurityEvent({
        type: 'rate_limit',
        severity: 'medium',
        description: `Rate limit exceeded for ${type}`,
        ip,
        timestamp: new Date().toISOString(),
        blocked: true
      });
      return false;
    }

    // Increment count
    existing.count++;
    return true;
  }

  checkSuspiciousContent(content: string, ip?: string): boolean {
    for (const pattern of this.config.suspiciousPatterns) {
      if (pattern.test(content)) {
        IntrusionDetectionService.logSecurityEvent({
          type: content.match(/script|iframe|object/gi) ? 'xss_attempt' : 'injection_attempt',
          severity: 'high',
          description: `Suspicious content detected: ${pattern.source}`,
          ip,
          timestamp: new Date().toISOString(),
          blocked: true
        });
        return false;
      }
    }
    return true;
  }

  recordFailedLogin(ip: string): boolean {
    const now = Date.now();
    const existing = this.failedLogins.get(ip);

    if (!existing) {
      this.failedLogins.set(ip, { count: 1, lastAttempt: now });
      return true;
    }

    // Reset if lockout period has passed
    if (now - existing.lastAttempt > this.config.lockoutDuration) {
      this.failedLogins.set(ip, { count: 1, lastAttempt: now });
      return true;
    }

    existing.count++;
    existing.lastAttempt = now;

    if (existing.count >= this.config.maxFailedLogins) {
      this.blockIP(ip);
      IntrusionDetectionService.logSecurityEvent({
        type: 'failed_login',
        severity: 'high',
        description: `IP blocked after ${existing.count} failed login attempts`,
        ip,
        timestamp: new Date().toISOString(),
        blocked: true
      });
      return false;
    }

    IntrusionDetectionService.logSecurityEvent({
      type: 'failed_login',
      severity: 'medium',
      description: `Failed login attempt ${existing.count}/${this.config.maxFailedLogins}`,
      ip,
      timestamp: new Date().toISOString(),
      blocked: false
    });

    return true;
  }

  clearFailedLogins(ip: string): void {
    this.failedLogins.delete(ip);
  }

  blockIP(ip: string): void {
    this.blockedIPs.add(ip);
    this.saveBlockedIPs();
  }

  unblockIP(ip: string): void {
    this.blockedIPs.delete(ip);
    this.saveBlockedIPs();
  }

  isIPBlocked(ip: string): boolean {
    return this.blockedIPs.has(ip);
  }

  // New methods needed by other services
  static isSessionBlocked(sessionId: string): boolean {
    const instance = IntrusionDetectionService.getInstance();
    return instance.blockedSessions.has(sessionId);
  }

  static analyzeBehavior(
    sessionId: string,
    action: string,
    userId?: string,
    metadata?: Record<string, any>
  ): void {
    const instance = IntrusionDetectionService.getInstance();
    const now = Date.now();
    
    // Calculate risk score based on action type
    let riskScore = 0;
    if (action.includes('failed') || action.includes('unauthorized')) {
      riskScore = 8;
    } else if (action.includes('suspicious')) {
      riskScore = 6;
    } else if (action.includes('admin')) {
      riskScore = 3;
    } else {
      riskScore = 1;
    }

    const pattern: BehaviorPattern = {
      sessionId,
      action,
      timestamp: now,
      userId,
      metadata,
      riskScore
    };

    if (!instance.behaviorPatterns.has(sessionId)) {
      instance.behaviorPatterns.set(sessionId, []);
    }

    const patterns = instance.behaviorPatterns.get(sessionId)!;
    patterns.push(pattern);

    // Keep only last 50 patterns per session
    if (patterns.length > 50) {
      patterns.splice(0, patterns.length - 50);
    }

    // Check for suspicious behavior
    const recentPatterns = patterns.filter(p => now - p.timestamp < 5 * 60 * 1000); // 5 minutes
    const avgRiskScore = recentPatterns.reduce((sum, p) => sum + p.riskScore, 0) / recentPatterns.length;

    if (avgRiskScore > 5 || recentPatterns.length > 20) {
      instance.blockedSessions.add(sessionId);
      IntrusionDetectionService.logSecurityEvent({
        type: 'suspicious_activity',
        severity: 'critical',
        description: `Session blocked due to suspicious behavior - Risk score: ${avgRiskScore.toFixed(2)}`,
        timestamp: new Date().toISOString(),
        blocked: true
      });
    }
  }

  static getStatistics(): {
    activeSessions: number;
    suspiciousSessions: number;
    blockedSessions: number;
    averageRiskScore: number;
  } {
    const instance = IntrusionDetectionService.getInstance();
    const now = Date.now();
    
    let totalSessions = 0;
    let suspiciousSessions = 0;
    let totalRiskScore = 0;

    for (const [sessionId, patterns] of instance.behaviorPatterns.entries()) {
      const recentPatterns = patterns.filter(p => now - p.timestamp < 30 * 60 * 1000); // 30 minutes
      if (recentPatterns.length > 0) {
        totalSessions++;
        const avgRisk = recentPatterns.reduce((sum, p) => sum + p.riskScore, 0) / recentPatterns.length;
        totalRiskScore += avgRisk;
        
        if (avgRisk > 3) {
          suspiciousSessions++;
        }
      }
    }

    return {
      activeSessions: totalSessions,
      suspiciousSessions,
      blockedSessions: instance.blockedSessions.size,
      averageRiskScore: totalSessions > 0 ? Math.round((totalRiskScore / totalSessions) * 10) / 10 : 0
    };
  }

  getSecurityEvents(): SecurityEvent[] {
    try {
      const stored = localStorage.getItem('security_events');
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error loading security events:', error);
      return [];
    }
  }

  getStoredEvents(): SecurityEvent[] {
    try {
      const stored = localStorage.getItem('security_events');
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error loading security events:', error);
      return [];
    }
  }

  clearSecurityEvents(): void {
    localStorage.removeItem('security_events');
  }

  getBlockedIPs(): string[] {
    return [...this.blockedIPs];
  }

  getFailedLoginAttempts(): Array<{ ip: string; count: number; lastAttempt: Date }> {
    return Array.from(this.failedLogins.entries()).map(([ip, data]) => ({
      ip,
      count: data.count,
      lastAttempt: new Date(data.lastAttempt)
    }));
  }

  updateConfig(newConfig: Partial<SecurityConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }

  getConfig(): SecurityConfig {
    return { ...this.config };
  }

  private static logSecurityEvent(event: SecurityEvent): void {
    console.warn('Security Event:', event);
    
    // Store in localStorage for admin review
    const events = IntrusionDetectionService.getStoredEvents();
    events.push({
      ...event,
      timestamp: new Date().toISOString()
    });
    
    // Keep only last 100 events
    const recentEvents = events.slice(-100);
    localStorage.setItem('security_events', JSON.stringify(recentEvents));
  }

  private static getStoredEvents(): SecurityEvent[] {
    try {
      const stored = localStorage.getItem('security_events');
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error loading security events:', error);
      return [];
    }
  }

  // Cleanup old entries periodically
  cleanup(): void {
    const now = Date.now();
    
    // Clean up rate limit entries
    for (const [key, data] of this.requestCounts.entries()) {
      const [, type] = key.split(':');
      const config = this.config.rateLimits[type as keyof SecurityConfig['rateLimits']];
      if (config && now - data.firstRequest > config.windowMs) {
        this.requestCounts.delete(key);
      }
    }

    // Clean up failed login entries
    for (const [ip, data] of this.failedLogins.entries()) {
      if (now - data.lastAttempt > this.config.lockoutDuration) {
        this.failedLogins.delete(ip);
      }
    }

    // Clean up old behavior patterns
    for (const [sessionId, patterns] of this.behaviorPatterns.entries()) {
      const recentPatterns = patterns.filter(p => now - p.timestamp < 60 * 60 * 1000); // 1 hour
      if (recentPatterns.length === 0) {
        this.behaviorPatterns.delete(sessionId);
      } else {
        this.behaviorPatterns.set(sessionId, recentPatterns);
      }
    }
  }

  // Start periodic cleanup
  startCleanup(): void {
    setInterval(() => {
      this.cleanup();
    }, 5 * 60 * 1000); // Every 5 minutes
  }
}
