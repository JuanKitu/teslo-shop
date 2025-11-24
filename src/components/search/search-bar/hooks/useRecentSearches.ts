import { useSearchStore } from '@/store';

export const useRecentSearches = () => {
  const recentSearches = useSearchStore((state) => state.recentSearches);
  const removeSearch = useSearchStore((state) => state.removeSearch);
  const clearAll = useSearchStore((state) => state.clearAllSearches);

  return {
    recentSearches,
    removeSearch,
    clearAll,
  };
};
