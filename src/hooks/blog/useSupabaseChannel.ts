
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export const useSupabaseChannel = (
  isMounted: { current: boolean },
  channelRef: { current: any },
  loadPosts: () => Promise<void>
) => {
  useEffect(() => {
    // Configuration du canal Supabase
    channelRef.current = supabase
      .channel('blog-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'blog_posts'
        },
        (payload) => {
          console.log('Changement détecté dans Supabase:', payload);
          if (isMounted.current) {
            loadPosts();
          }
        }
      )
      .subscribe();

    // Écouter les événements personnalisés
    const handleCustomEvent = () => {
      console.log('Événement personnalisé de mise à jour détecté');
      if (isMounted.current) {
        loadPosts();
      }
    };
    
    window.addEventListener('blogPostsUpdated', handleCustomEvent);
    
    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
      }
      window.removeEventListener('blogPostsUpdated', handleCustomEvent);
    };
  }, [loadPosts, channelRef, isMounted]);
};
