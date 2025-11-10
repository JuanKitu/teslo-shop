'use client';

import React, { useRef, useEffect } from 'react';
import { SearchResults } from './SearchResults';
import { TrendingSearches } from './TrendingSearches';
import { RecentSearches } from './RecentSearches';
import { getSearchBarStyles } from './styles';
import { RecentSearch, SearchResult, TrendingSearch } from '@/interfaces';

interface Props {
  isOpen: boolean;
  query: string;
  results: SearchResult[];
  trending: TrendingSearch[];
  recentSearches: RecentSearch[];
  selectedIndex: number;
  loading: boolean;
  isDark: boolean;
  onClose: () => void;
  onSelectTrending: (term: string) => void;
  onSelectRecent: (term: string) => void;
  onRemoveRecent: (term: string) => void;
  onClearAllRecent: () => void;
}

export const SearchDropdown: React.FC<Props> = ({
  isOpen,
  query,
  results,
  trending,
  recentSearches,
  selectedIndex,
  loading,
  isDark,
  onClose,
  onSelectTrending,
  onSelectRecent,
  onRemoveRecent,
  onClearAllRecent,
}) => {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const styles = getSearchBarStyles(isDark);

  // Click outside to close
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

  // Estado: cargando
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

  // Estado: búsqueda activa sin resultados
  if (query.trim().length >= 2 && results.length === 0) {
    return (
      <div ref={dropdownRef} className={styles.dropdown}>
        <div className={styles.emptyState}>
          <div className="text-4xl mb-2">😔</div>
          <p className="font-medium mb-1">No encontramos resultados para {query}</p>
          <p className="text-sm">Intenta con otros términos de búsqueda</p>
        </div>
      </div>
    );
  }

  // Estado: resultados encontrados
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

  // Estado: dropdown inicial (trending + recientes)
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
