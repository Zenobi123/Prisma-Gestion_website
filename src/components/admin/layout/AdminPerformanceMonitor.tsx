
import { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RealtimeService } from '@/services/realtimeService';
import { ErrorService } from '@/services/errorService';

export const AdminPerformanceMonitor = () => {
  const [realtimeConnections, setRealtimeConnections] = useState(0);
  const [errorCount, setErrorCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const updateStats = () => {
      setRealtimeConnections(RealtimeService.getActiveSubscriptions());
      setErrorCount(ErrorService.getRecentErrors(1).length);
    };

    updateStats();
    const interval = setInterval(updateStats, 5000);

    return () => clearInterval(interval);
  }, []);

  // Show only in development or if there are issues
  useEffect(() => {
    setIsVisible(
      import.meta.env.DEV || 
      errorCount > 0 || 
      realtimeConnections > 10
    );
  }, [errorCount, realtimeConnections]);

  if (!isVisible) return null;

  return (
    <Card className="fixed bottom-4 right-4 w-64 z-50 bg-white/95 backdrop-blur">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">Performance</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-600">Connexions temps réel</span>
          <Badge variant={realtimeConnections > 5 ? "destructive" : "secondary"}>
            {realtimeConnections}
          </Badge>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-600">Erreurs (1h)</span>
          <Badge variant={errorCount > 0 ? "destructive" : "secondary"}>
            {errorCount}
          </Badge>
        </div>
        {import.meta.env.DEV && (
          <div className="text-xs text-blue-600 mt-2">
            Mode développement
          </div>
        )}
      </CardContent>
    </Card>
  );
};
