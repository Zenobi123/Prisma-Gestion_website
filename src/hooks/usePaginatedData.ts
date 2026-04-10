
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';
import { cacheService } from '@/services/cacheService';

type TableName = keyof Database['public']['Tables'];

interface PaginationOptions {
  pageSize?: number;
  orderBy?: string;
  ascending?: boolean;
}

interface UsePaginatedDataResult<T> {
  data: T[];
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  currentPage: number;
  totalCount: number;
  loadMore: () => void;
  refresh: () => void;
  goToPage: (page: number) => void;
}

export function usePaginatedData<T = any>(
  tableName: TableName,
  options: PaginationOptions = {}
): UsePaginatedDataResult<T> {
  const {
    pageSize = 10,
    orderBy = 'created_at',
    ascending = false
  } = options;

  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const fetchData = useCallback(async (page: number, append = false) => {
    const cacheKey = `paginated:${tableName}:${page}:${pageSize}:${orderBy}:${ascending}`;
    
    try {
      setLoading(true);
      setError(null);

      // Vérifier le cache pour cette page
      const cachedData = cacheService.get<{ data: T[], totalCount: number }>(cacheKey);
      if (cachedData && !append) {
        console.log(`Cache hit pour ${tableName} page ${page}`);
        setData(cachedData.data);
        setTotalCount(cachedData.totalCount);
        setHasMore(cachedData.data.length === pageSize && (page + 1) * pageSize < cachedData.totalCount);
        setLoading(false);
        return;
      }

      // Requête optimisée avec comptage en parallèle
      const [countResult, dataResult] = await Promise.all([
        supabase
          .from(tableName)
          .select('*', { count: 'exact', head: true }),
        supabase
          .from(tableName)
          .select('*')
          .order(orderBy, { ascending })
          .range(page * pageSize, (page + 1) * pageSize - 1)
      ]);

      if (countResult.error) throw countResult.error;
      if (dataResult.error) throw dataResult.error;

      const count = countResult.count || 0;
      const pageData = dataResult.data as T[];
      
      // Mettre en cache les données
      cacheService.set(cacheKey, { data: pageData, totalCount: count }, 60000); // 1 minute
      
      setTotalCount(count);
      
      if (append) {
        setData(prev => [...prev, ...pageData]);
      } else {
        setData(pageData);
      }

      setHasMore(pageData.length === pageSize && (page + 1) * pageSize < count);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [tableName, pageSize, orderBy, ascending]);

  const loadMore = useCallback(() => {
    if (!loading && hasMore) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      fetchData(nextPage, true);
    }
  }, [currentPage, fetchData, hasMore, loading]);

  const goToPage = useCallback((page: number) => {
    setCurrentPage(page);
    fetchData(page, false);
  }, [fetchData]);

  const refresh = useCallback(() => {
    // Invalider le cache pour cette table
    cacheService.invalidatePattern(`paginated:${tableName}:`);
    setCurrentPage(0);
    fetchData(0, false);
  }, [fetchData, tableName]);

  useEffect(() => {
    fetchData(0, false);
  }, [fetchData]);

  return {
    data,
    loading,
    error,
    hasMore,
    currentPage,
    totalCount,
    loadMore,
    refresh,
    goToPage
  };
}
