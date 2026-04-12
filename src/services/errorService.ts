interface ErrorLog {
  id: string;
  timestamp: Date;
  error: Error;
  context?: Record<string, any>;
  userId?: string;
  url?: string;
  userAgent?: string;
  level: 'error' | 'warning' | 'info';
}

export class ErrorService {
  private static logs: ErrorLog[] = [];
  private static maxLogs = 100;
  private static sensitiveKeys = ['password', 'token', 'key', 'secret', 'auth'];

  private static sanitizeContext(context: Record<string, any>): Record<string, any> {
    const sanitized = { ...context };
    
    // Supprimer les données sensibles
    Object.keys(sanitized).forEach(key => {
      if (this.sensitiveKeys.some(sensitive => key.toLowerCase().includes(sensitive))) {
        sanitized[key] = '[REDACTED]';
      }
    });
    
    return sanitized;
  }

  static logError(error: Error, context?: Record<string, any>, level: 'error' | 'warning' | 'info' = 'error'): void {
    try {
      const sanitizedContext = context ? this.sanitizeContext(context) : undefined;
      
      const errorLog: ErrorLog = {
        id: crypto.randomUUID(),
        timestamp: new Date(),
        error: {
          name: error.name,
          message: error.message,
          stack: error.stack,
        } as Error,
        context: sanitizedContext,
        url: window.location.href,
        userAgent: navigator.userAgent,
        level,
      };

      this.logs.unshift(errorLog);
      
      // Keep only the last maxLogs entries
      if (this.logs.length > this.maxLogs) {
        this.logs = this.logs.slice(0, this.maxLogs);
      }

      // Log to console in development
      if (import.meta.env.DEV) {
        console.error('Error logged:', errorLog);
      }

      // En production, vous pourriez envoyer vers un service externe
      if (import.meta.env.PROD && level === 'error') {
        this.sendToExternalService(errorLog);
      }
    } catch (loggingError) {
      console.error('Failed to log error:', loggingError);
    }
  }

  static getLogs(): ErrorLog[] {
    return [...this.logs];
  }

  static clearLogs(): void {
    this.logs = [];
  }

  static getLogsCount(): number {
    return this.logs.length;
  }

  static getRecentErrors(hours: number = 24): ErrorLog[] {
    const cutoff = new Date(Date.now() - hours * 60 * 60 * 1000);
    return this.logs.filter(log => log.timestamp > cutoff);
  }

  static getErrorsByLevel(level: 'error' | 'warning' | 'info'): ErrorLog[] {
    return this.logs.filter(log => log.level === level);
  }

  private static async sendToExternalService(errorLog: ErrorLog): Promise<void> {
    // Implementation pour service externe (Sentry, LogRocket, etc.)
    try {
      // Exemple d'envoi vers un webhook ou service de monitoring
      // await fetch('/api/errors', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(errorLog)
      // });
    } catch (error) {
      console.error('Failed to send error to external service:', error);
    }
  }
}

// Global error handlers avec protection renforcée
window.addEventListener('error', (event) => {
  ErrorService.logError(
    event.error || new Error(event.message),
    {
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno,
      type: 'javascript_error'
    }
  );
});

window.addEventListener('unhandledrejection', (event) => {
  ErrorService.logError(
    new Error(event.reason?.message || 'Unhandled Promise Rejection'),
    {
      type: 'unhandled_promise_rejection',
      reason: typeof event.reason === 'string' ? event.reason : 'Unknown reason'
    }
  );
});

// Network error monitoring
const originalFetch = window.fetch;
window.fetch = async (...args) => {
  try {
    const response = await originalFetch(...args);
    
    // Log des erreurs de réseau critiques
    if (!response.ok && response.status >= 500) {
      ErrorService.logError(
        new Error(`Network Error: ${response.status} ${response.statusText}`),
        {
          url: args[0],
          status: response.status,
          type: 'network_error'
        },
        'warning'
      );
    }
    
    return response;
  } catch (error) {
    ErrorService.logError(
      error as Error,
      {
        url: args[0],
        type: 'fetch_error'
      }
    );
    throw error;
  }
};
