
import { useEffect, useRef } from 'react';
import { RealtimeService, RealtimeEventType } from '@/services/realtimeService';

interface UseRealtimeDataProps {
  tableName: string;
  onDataChange: (payload: any) => void;
  events?: RealtimeEventType[];
  enabled?: boolean;
}

export const useRealtimeData = ({
  tableName,
  onDataChange,
  events = ['INSERT', 'UPDATE', 'DELETE'],
  enabled = true
}: UseRealtimeDataProps) => {
  const subscriptionRef = useRef<any>(null);

  useEffect(() => {
    if (!enabled) return;

    subscriptionRef.current = RealtimeService.subscribeToTable(
      tableName,
      onDataChange,
      events
    );

    return () => {
      if (subscriptionRef.current) {
        subscriptionRef.current.unsubscribe();
      }
    };
  }, [tableName, onDataChange, events, enabled]);

  const cleanup = () => {
    if (subscriptionRef.current) {
      subscriptionRef.current.unsubscribe();
      subscriptionRef.current = null;
    }
  };

  return { cleanup };
};
