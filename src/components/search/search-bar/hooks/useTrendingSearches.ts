import { useState, useEffect } from 'react';
import { getTrendingSearches } from '@/actions';
import { TrendingSearch } from '@/interfaces';

export const useTrendingSearches = (limit: number = 5) => {
  const [trending, setTrending] = useState<TrendingSearch[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTrending = async () => {
      setLoading(true);
      try {
        const { ok, trending: data } = await getTrendingSearches(limit);
        if (ok) {
          setTrending(data);
        }
      } catch (error) {
        console.error('Error loading trending:', error);
      } finally {
        setLoading(false);
      }
    };

    loadTrending();
  }, [limit]);

  return { trending, loading };
};
