'use client';

import React, { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { SearchInput } from './SearchInput';
import { SearchDropdown } from './ SearchDropdown';
import { useSearch } from './hooks/useSearch';
import { useRecentSearches } from './hooks/useRecentSearches';
import { useTrendingSearches } from './hooks/useTrendingSearches';
import { getSearchBarStyles } from './styles';

export function SearchBar() {
  const [mounted, setMounted] = useState(false);
  const { theme } = useTheme();

  const {
    query,
    results,
    loading,
    isOpen,
    selectedIndex,
    suggestion,
    applySuggestion,
    setIsOpen,
    handleInputChange,
    handleKeyDown,
    clearSearch,
  } = useSearch();

  const { recentSearches, removeSearch, clearAll } = useRecentSearches();
  const { trending } = useTrendingSearches(5);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-full max-w-2xl">
        <div className="h-11 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
      </div>
    );
  }

  const isDark = theme === 'dark';
  const styles = getSearchBarStyles(isDark);

  const handleSelectTrending = (term: string) => {
    handleInputChange(term);
  };

  const handleSelectRecent = (term: string) => {
    handleInputChange(term);
  };

  const handleClear = () => {
    clearSearch();
  };

  return (
    <div className={styles.container}>
      <SearchInput
        value={query}
        loading={loading}
        isDark={isDark}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onClear={handleClear}
        onFocus={() => setIsOpen(true)}
      />

      <SearchDropdown
        isOpen={isOpen}
        query={query}
        results={results}
        trending={trending}
        recentSearches={recentSearches}
        selectedIndex={selectedIndex}
        loading={loading}
        suggestion={suggestion} // ✅ Nuevo
        isDark={isDark}
        onClose={() => setIsOpen(false)}
        onSelectTrending={handleSelectTrending}
        onSelectRecent={handleSelectRecent}
        onRemoveRecent={removeSearch}
        onClearAllRecent={clearAll}
        onApplySuggestion={applySuggestion} // ✅ Nuevo
      />
    </div>
  );
}
