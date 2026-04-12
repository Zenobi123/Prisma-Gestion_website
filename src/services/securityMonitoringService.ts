
import { ErrorService } from './errorService';

interface SecurityEvent {
  id: string;
  timestamp: Date;
  type: 'authentication' | 'authorization' | 'data_access' | 'suspicious_activity' | 'security_violation';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  userAgent?: string;
  ipAddress?: string;
  userId?: string;
  metadata?: Record<string, any>;
}

interface SecurityAlert {
  id: string;
  timestamp: Date;
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  resolved: boolean;
  events: SecurityEvent[];
}

export class SecurityMonitoringService {
  private static events: SecurityEvent[] = [];
  private static alerts: SecurityAlert[] = [];
  private static readonly MAX_EVENTS = 1000;
  private static readonly MAX_ALERTS = 100;

  // Enregistrer un événement de sécurité
  static logSecurityEvent(
    type: SecurityEvent['type'],
    severity: SecurityEvent['severity'],
    description: string,
    metadata?: Record<string, any>
  ): void {
    const event: SecurityEvent = {
      id: crypto.randomUUID(),
      timestamp: new Date(),
      type,
      severity,
      description,
      userAgent: navigator.userAgent,
      metadata: this.sanitizeMetadata(metadata),
    };

    this.events.unshift(event);
    
    // Garder seulement les derniers événements
    if (this.events.length > this.MAX_EVENTS) {
      this.events = this.events.slice(0, this.MAX_EVENTS);
    }

    // Créer une alerte pour les événements critiques
    if (severity === 'critical' || severity === 'high') {
      this.createAlert(event);
    }

    // Log dans la console en développement
    if (import.meta.env.DEV) {
      console.warn(`[SECURITY] ${severity.toUpperCase()}: ${description}`, event);
    }
  }

  // Créer une alerte de sécurité
  private static createAlert(event: SecurityEvent): void {
    const alert: SecurityAlert = {
      id: crypto.randomUUID(),
      timestamp: new Date(),
      title: `Alerte de sécurité: ${event.type}`,
      description: event.description,
      severity: event.severity,
      resolved: false,
      events: [event]
    };

    this.alerts.unshift(alert);
    
    if (this.alerts.length > this.MAX_ALERTS) {
      this.alerts = this.alerts.slice(0, this.MAX_ALERTS);
    }
  }

  // Détection d'activité suspecte
  static detectSuspiciousActivity(): void {
    const recentEvents = this.events.filter(
      event => Date.now() - event.timestamp.getTime() < 5 * 60 * 1000 // 5 minutes
    );

    // Trop de tentatives de connexion
    const authFailures = recentEvents.filter(
      event => event.type === 'authentication' && event.description.includes('échec')
    );
    
    if (authFailures.length >= 5) {
      this.logSecurityEvent(
        'suspicious_activity',
        'high',
        `Tentatives de connexion suspectes détectées: ${authFailures.length} échecs en 5 minutes`,
        { failureCount: authFailures.length }
      );
    }

    // Accès non autorisé répété
    const authorizationFailures = recentEvents.filter(
      event => event.type === 'authorization' && event.severity === 'high'
    );
    
    if (authorizationFailures.length >= 3) {
      this.logSecurityEvent(
        'suspicious_activity',
        'critical',
        `Tentatives d'accès non autorisé répétées: ${authorizationFailures.length} échecs`,
        { unauthorizedAttempts: authorizationFailures.length }
      );
    }
  }

  // Audit de sécurité
  static generateSecurityReport(): {
    summary: {
      totalEvents: number;
      activeAlerts: number;
      criticalEvents: number;
      highSeverityEvents: number;
    };
    events: SecurityEvent[];
    alerts: SecurityAlert[];
    recommendations: string[];
  } {
    const criticalEvents = this.events.filter(e => e.severity === 'critical').length;
    const highSeverityEvents = this.events.filter(e => e.severity === 'high').length;
    const activeAlerts = this.alerts.filter(a => !a.resolved).length;

    const recommendations: string[] = [];
    
    if (criticalEvents > 0) {
      recommendations.push(`${criticalEvents} événements critiques nécessitent une attention immédiate`);
    }
    
    if (activeAlerts > 5) {
      recommendations.push('Nombre élevé d\'alertes actives - révision des politiques de sécurité recommandée');
    }
    
    if (this.events.filter(e => e.type === 'authentication').length > 10) {
      recommendations.push('Considérer l\'implémentation de l\'authentification multi-facteurs');
    }

    return {
      summary: {
        totalEvents: this.events.length,
        activeAlerts,
        criticalEvents,
        highSeverityEvents
      },
      events: this.events.slice(0, 50), // 50 derniers événements
      alerts: this.alerts.filter(a => !a.resolved),
      recommendations
    };
  }

  // Nettoyer les métadonnées sensibles
  private static sanitizeMetadata(metadata?: Record<string, any>): Record<string, any> | undefined {
    if (!metadata) return undefined;
    
    const sensitiveKeys = ['password', 'token', 'key', 'secret', 'auth', 'session'];
    const sanitized = { ...metadata };
    
    Object.keys(sanitized).forEach(key => {
      if (sensitiveKeys.some(sensitive => key.toLowerCase().includes(sensitive))) {
        sanitized[key] = '[REDACTED]';
      }
    });
    
    return sanitized;
  }

  // Résoudre une alerte
  static resolveAlert(alertId: string): boolean {
    const alert = this.alerts.find(a => a.id === alertId);
    if (alert) {
      alert.resolved = true;
      return true;
    }
    return false;
  }

  // Obtenir les événements par type
  static getEventsByType(type: SecurityEvent['type']): SecurityEvent[] {
    return this.events.filter(event => event.type === type);
  }

  // Obtenir les alertes actives
  static getActiveAlerts(): SecurityAlert[] {
    return this.alerts.filter(alert => !alert.resolved);
  }

  // Effacer les anciens événements
  static cleanupOldEvents(maxAge: number = 24 * 60 * 60 * 1000): void {
    const cutoff = new Date(Date.now() - maxAge);
    this.events = this.events.filter(event => event.timestamp > cutoff);
    this.alerts = this.alerts.filter(alert => alert.timestamp > cutoff);
  }
}

// Démarrer la surveillance automatique
setInterval(() => {
  SecurityMonitoringService.detectSuspiciousActivity();
  SecurityMonitoringService.cleanupOldEvents();
}, 60000); // Vérifier chaque minute
