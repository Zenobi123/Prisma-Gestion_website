
import { useQuery, useQueryClient, UseQueryOptions } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useRealtimeData } from './useRealtimeData';
import { cacheService } from '@/services/cacheService';

interface UseOptimizedQueryProps<T> {
  queryKey: string[];
  queryFn: () => Promise<T>;
  tableName?: string;
  realtimeEnabled?: boolean;
  cacheTime?: number;
  staleTime?: number;
  options?: Omit<UseQueryOptions<T>, 'queryKey' | 'queryFn'>;
}

export function useOptimizedQuery<T>({
  queryKey,
  queryFn,
  tableName,
  realtimeEnabled = true,
  cacheTime = 10 * 60 * 1000, // 10 minutes
  staleTime = 2 * 60 * 1000, // 2 minutes
  options = {}
}: UseOptimizedQueryProps<T>) {
  const queryClient = useQueryClient();
  const cacheKey = queryKey.join(':');

  // Fonction de requête optimisée avec cache local
  const optimizedQueryFn = async (): Promise<T> => {
    // Vérifier le cache local d'abord
    const cachedData = cacheService.get<T>(cacheKey);
    if (cachedData) {
      console.log(`Cache hit for ${cacheKey}`);
      return cachedData;
    }

    console.log(`Cache miss for ${cacheKey}, fetching from API`);
    const data = await queryFn();
    
    // Mettre en cache les données
    cacheService.set(cacheKey, data, staleTime);
    
    return data;
  };

  const query = useQuery({
    queryKey,
    queryFn: optimizedQueryFn,
    staleTime,
    gcTime: cacheTime,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    ...options
  });

  // Configuration des mises à jour temps réel
  useRealtimeData({
    tableName: tableName || '',
    onDataChange: () => {
      console.log(`Realtime update for table ${tableName}`);
      cacheService.invalidate(cacheKey);
      queryClient.invalidateQueries({ queryKey });
    },
    enabled: realtimeEnabled && !!tableName
  });

  const prefetch = (prefetchQueryFn?: () => Promise<T>) => {
    queryClient.prefetchQuery({
      queryKey,
      queryFn: prefetchQueryFn || optimizedQueryFn,
      staleTime
    });
  };

  const invalidate = () => {
    cacheService.invalidate(cacheKey);
    queryClient.invalidateQueries({ queryKey });
  };

  return {
    ...query,
    prefetch,
    invalidate
  };
}
