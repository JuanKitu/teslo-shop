import { create, StateCreator } from 'zustand';
import { persist } from 'zustand/middleware';

// Types
export interface RecentSearch {
  term: string;
  timestamp: number;
  resultsCount: number;
}

interface SearchState {
  recentSearches: RecentSearch[];
  maxRecent: number;
}

interface SearchActions {
  addSearch: (term: string, resultsCount: number) => void;
  removeSearch: (term: string) => void;
  clearAllSearches: () => void;
}

type SearchStore = SearchState & SearchActions;

// Store API
const storeAPI: StateCreator<SearchStore> = (set) => ({
  // State
  recentSearches: [],
  maxRecent: 5,

  // Actions
  addSearch: (term: string, resultsCount: number) =>
    set((state) => {
      // Filtrar duplicados (case insensitive)
      const filtered = state.recentSearches.filter(
        (s) => s.term.toLowerCase() !== term.toLowerCase()
      );

      // Agregar al inicio y limitar
      const updated = [{ term, timestamp: Date.now(), resultsCount }, ...filtered].slice(
        0,
        state.maxRecent
      );

      return { recentSearches: updated };
    }),

  removeSearch: (term: string) =>
    set((state) => ({
      recentSearches: state.recentSearches.filter((s) => s.term !== term),
    })),

  clearAllSearches: () => set({ recentSearches: [] }),
});

// Create a store con persist middleware
export const useSearchStore = create<SearchStore>()(
  persist(storeAPI, {
    name: 'search-storage', // nombre en localStorage
    // Solo persistir lo necesario
    partialize: (state) => ({
      recentSearches: state.recentSearches,
    }),
  })
);
