'use client';

import React, { useRef, useEffect } from 'react';
import { IoSparklesOutline } from 'react-icons/io5';
import { SearchResults } from './SearchResults';
import { TrendingSearches } from './TrendingSearches';
import { RecentSearches } from './RecentSearches';
import { getSearchBarStyles } from './styles';
import type { SearchResult, TrendingSearch, RecentSearch } from '@/interfaces';

interface Props {
  isOpen: boolean;
  query: string;
  results: SearchResult[];
  trending: TrendingSearch[];
  recentSearches: RecentSearch[];
  selectedIndex: number;
  loading: boolean;
  suggestion?: string; // ✅ Nuevo
  isDark: boolean;
  onClose: () => void;
  onSelectTrending: (term: string) => void;
  onSelectRecent: (term: string) => void;
  onRemoveRecent: (term: string) => void;
  onClearAllRecent: () => void;
  onApplySuggestion?: () => void; // ✅ Nuevo
}

export const SearchDropdown: React.FC<Props> = ({
  isOpen,
  query,
  results,
  trending,
  recentSearches,
  selectedIndex,
  loading,
  suggestion,
  isDark,
  onClose,
  onSelectTrending,
  onSelectRecent,
  onRemoveRecent,
  onClearAllRecent,
  onApplySuggestion,
}) => {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const styles = getSearchBarStyles(isDark);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  if (loading) {
    return (
      <div ref={dropdownRef} className={styles.dropdown}>
        <div className={styles.emptyState}>
          <div className="flex items-center justify-center gap-2">
            <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
            <span>Buscando...</span>
          </div>
        </div>
      </div>
    );
  }

  // ✅ Sugerencia de corrección
  if (query.trim().length >= 2 && results.length === 0 && suggestion) {
    return (
      <div ref={dropdownRef} className={styles.dropdown}>
        <div className={styles.emptyState}>
          <div className="text-4xl mb-2">🤔</div>
          <p className="font-medium mb-3">No encontramos resultados para &#34;{query}&#34;</p>

          <button
            onClick={onApplySuggestion}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              isDark
                ? 'bg-blue-950/30 text-blue-400 hover:bg-blue-950/50 border border-blue-900'
                : 'bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-200'
            }`}
          >
            <IoSparklesOutline className="w-4 h-4" />
            <span>
              Quizás quisiste decir: <strong>&#34;{suggestion}&#34;</strong>
            </span>
          </button>
        </div>
      </div>
    );
  }

  if (query.trim().length >= 2 && results.length === 0) {
    return (
      <div ref={dropdownRef} className={styles.dropdown}>
        <div className={styles.emptyState}>
          <div className="text-4xl mb-2">😔</div>
          <p className="font-medium mb-1">No encontramos resultados para &#34;{query}&#34;</p>
          <p className="text-sm">Intenta con otros términos de búsqueda</p>
        </div>
      </div>
    );
  }

  if (query.trim().length >= 2 && results.length > 0) {
    return (
      <div ref={dropdownRef} className={styles.dropdown}>
        <SearchResults
          results={results}
          selectedIndex={selectedIndex}
          onClose={onClose}
          isDark={isDark}
        />
      </div>
    );
  }

  if (query.trim().length < 2) {
    return (
      <div ref={dropdownRef} className={styles.dropdown}>
        <TrendingSearches trending={trending} onSelect={onSelectTrending} isDark={isDark} />

        {trending.length > 0 && recentSearches.length > 0 && (
          <div
            className={`border-t ${isDark ? 'border-[var(--color-border)]' : 'border-gray-200'}`}
          />
        )}

        <RecentSearches
          searches={recentSearches}
          onSelect={onSelectRecent}
          onRemove={onRemoveRecent}
          onClearAll={onClearAllRecent}
          isDark={isDark}
        />

        {trending.length === 0 && recentSearches.length === 0 && (
          <div className={styles.emptyState}>
            <div className="text-4xl mb-2">🔍</div>
            <p className="font-medium">Empieza a buscar</p>
            <p className="text-sm">Encuentra tus productos favoritos</p>
          </div>
        )}
      </div>
    );
  }

  return null;
};
