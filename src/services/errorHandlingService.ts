
interface ErrorEntry {
  message: string;
  count: number;
  lastOccurrence: number;
  suppressed: boolean;
}

export class ErrorHandlingService {
  private static instance: ErrorHandlingService;
  private errors = new Map<string, ErrorEntry>();
  private suppressionThreshold = 3;
  private suppressionWindow = 60000; // 1 minute

  static getInstance(): ErrorHandlingService {
    if (!ErrorHandlingService.instance) {
      ErrorHandlingService.instance = new ErrorHandlingService();
    }
    return ErrorHandlingService.instance;
  }

  logError(error: Error | string, context?: string): boolean {
    const message = error instanceof Error ? error.message : error;
    const key = context ? `${context}:${message}` : message;
    const now = Date.now();

    const existing = this.errors.get(key);

    if (existing) {
      // Réinitialiser si l'erreur n'est pas survenue récemment
      if (now - existing.lastOccurrence > this.suppressionWindow) {
        existing.count = 1;
        existing.suppressed = false;
      } else {
        existing.count++;
      }
      existing.lastOccurrence = now;

      // Supprimer les erreurs répétitives
      if (existing.count >= this.suppressionThreshold) {
        existing.suppressed = true;
        return false; // Ne pas logger
      }
    } else {
      this.errors.set(key, {
        message,
        count: 1,
        lastOccurrence: now,
        suppressed: false
      });
    }

    // Logger l'erreur seulement si elle n'est pas supprimée
    console.error(`[${context || 'App'}] ${message}`);
    return true;
  }

  cleanup(): void {
    const now = Date.now();
    const cleanupThreshold = 5 * 60 * 1000; // 5 minutes

    for (const [key, entry] of this.errors.entries()) {
      if (now - entry.lastOccurrence > cleanupThreshold) {
        this.errors.delete(key);
      }
    }
  }

  startCleanupInterval(): void {
    setInterval(() => {
      this.cleanup();
    }, 60000); // Nettoyage toutes les minutes
  }
}

export const errorHandler = ErrorHandlingService.getInstance();
