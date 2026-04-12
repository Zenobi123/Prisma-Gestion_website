
import { useEffect, useRef, useCallback } from 'react';
import { clearSectionsCache } from '@/utils/siteSections';

export const useHomeContentManager = () => {
  const isFirstLoad = useRef(true);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();
  const intervalRef = useRef<ReturnType<typeof setInterval>>();

  const dispatchUpdateEvent = useCallback(() => {
    console.log("Déclenchement de la mise à jour du contenu de la page d'accueil");
    clearSectionsCache();
    window.dispatchEvent(new CustomEvent('home-content-update', {
      detail: { 
        timestamp: new Date().getTime(),
        forceRefresh: true
      }
    }));
  }, []);

  const initializeContentManager = useCallback(() => {
    if (isFirstLoad.current) {
      dispatchUpdateEvent();
      isFirstLoad.current = false;
    }

    // Initial update after 2 seconds
    timeoutRef.current = setTimeout(dispatchUpdateEvent, 2000);
    
    // Periodic updates every minute
    intervalRef.current = setInterval(dispatchUpdateEvent, 60000);
  }, [dispatchUpdateEvent]);

  const cleanup = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  }, []);

  return {
    initializeContentManager,
    cleanup,
    dispatchUpdateEvent
  };
};
