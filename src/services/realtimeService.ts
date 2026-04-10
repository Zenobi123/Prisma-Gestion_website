
import { supabase } from '@/integrations/supabase/client';

export type RealtimeEventType = 'INSERT' | 'UPDATE' | 'DELETE';

export interface RealtimeSubscription {
  channel: any;
  unsubscribe: () => void;
}

export class RealtimeService {
  private static subscriptions = new Map<string, RealtimeSubscription>();

  static subscribeToTable(
    tableName: string,
    callback: (payload: any) => void,
    events: RealtimeEventType[] = ['INSERT', 'UPDATE', 'DELETE']
  ): RealtimeSubscription {
    const channelName = `realtime-${tableName}-${Date.now()}`;
    
    const channel = supabase.channel(channelName);
    
    // Configure the channel for database changes using the correct API
    events.forEach(event => {
      channel.on(
        'postgres_changes' as any,
        {
          event,
          schema: 'public',
          table: tableName
        },
        callback
      );
    });

    // Subscribe to the channel
    channel.subscribe((status) => {
      console.log(`Realtime subscription status for ${tableName}:`, status);
    });

    const subscription = {
      channel,
      unsubscribe: () => {
        supabase.removeChannel(channel);
        this.subscriptions.delete(channelName);
      }
    };

    this.subscriptions.set(channelName, subscription);
    return subscription;
  }

  static unsubscribeAll(): void {
    this.subscriptions.forEach(subscription => {
      subscription.unsubscribe();
    });
    this.subscriptions.clear();
  }

  static getActiveSubscriptions(): number {
    return this.subscriptions.size;
  }
}
