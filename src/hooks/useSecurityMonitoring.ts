
import { useState, useEffect } from 'react';
import { SecurityMonitoringService } from '@/services/securityMonitoringService';
import { IntrusionDetectionService } from '@/services/intrusionDetectionService';
import { useAuth } from '@/contexts/AuthContext';

interface SecurityDashboard {
  events: any[];
  alerts: any[];
  statistics: any;
  intrusionStats: any;
  recommendations: string[];
}

export const useSecurityMonitoring = () => {
  const { user } = useAuth();
  const [dashboard, setDashboard] = useState<SecurityDashboard>({
    events: [],
    alerts: [],
    statistics: { totalEvents: 0, activeAlerts: 0, criticalEvents: 0, highSeverityEvents: 0 },
    intrusionStats: { activeSessions: 0, suspiciousSessions: 0, blockedSessions: 0, averageRiskScore: 0 },
    recommendations: []
  });
  const [loading, setLoading] = useState(true);

  const refreshDashboard = () => {
    try {
      const report = SecurityMonitoringService.generateSecurityReport();
      const intrusionStats = IntrusionDetectionService.getStatistics();
      
      setDashboard({
        events: report.events,
        alerts: report.alerts,
        statistics: report.summary,
        intrusionStats,
        recommendations: report.recommendations
      });
    } catch (error) {
      console.error('Erreur lors du rafraîchissement du tableau de bord sécurité:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshDashboard();
    
    // Rafraîchir toutes les 30 secondes
    const interval = setInterval(refreshDashboard, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const logSecurityEvent = (
    type: 'authentication' | 'authorization' | 'data_access' | 'suspicious_activity' | 'security_violation',
    severity: 'low' | 'medium' | 'high' | 'critical',
    description: string,
    metadata?: Record<string, any>
  ) => {
    SecurityMonitoringService.logSecurityEvent(type, severity, description, metadata);
    
    // Analyser le comportement pour la détection d'intrusion
    if (user) {
      const sessionId = sessionStorage.getItem('session-id') || crypto.randomUUID();
      sessionStorage.setItem('session-id', sessionId);
      
      IntrusionDetectionService.analyzeBehavior(
        sessionId,
        `${type}_${description.toLowerCase().replace(/\s+/g, '_')}`,
        user.id,
        metadata
      );
    }
    
    // Rafraîchir le tableau de bord après un événement critique
    if (severity === 'critical' || severity === 'high') {
      setTimeout(refreshDashboard, 1000);
    }
  };

  const resolveAlert = (alertId: string) => {
    const resolved = SecurityMonitoringService.resolveAlert(alertId);
    if (resolved) {
      refreshDashboard();
    }
    return resolved;
  };

  return {
    dashboard,
    loading,
    refreshDashboard,
    logSecurityEvent,
    resolveAlert
  };
};
