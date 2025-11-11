import React, { useState, useCallback, useRef, useEffect } from 'react';
import { searchProducts, saveSearch } from '@/actions';
import { useSearchStore } from '@/store';
import { SearchResult } from '@/interfaces';

export const useSearch = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [suggestion, setSuggestion] = useState<string | undefined>(); // ✅ Nuevo

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const addSearch = useSearchStore((state) => state.addSearch);

  const performSearch = useCallback(
    async (searchTerm: string) => {
      if (!searchTerm || searchTerm.trim().length < 2) {
        setResults([]);
        setSuggestion(undefined);
        return;
      }

      setLoading(true);
      try {
        const {
          ok,
          results: searchResults,
          total,
          suggestion: searchSuggestion,
        } = await searchProducts(searchTerm, 10);

        if (ok) {
          setResults(searchResults);
          setSuggestion(searchSuggestion); // ✅ Guardar sugerencia
          addSearch(searchTerm, total);

          saveSearch({ term: searchTerm, resultsCount: total }).catch((error) => {
            console.error('Error saving search to DB:', error);
          });
        }
      } catch (error) {
        console.error('Search error:', error);
        setResults([]);
        setSuggestion(undefined);
      } finally {
        setLoading(false);
      }
    },
    [addSearch]
  );

  const handleInputChange = useCallback(
    (value: string) => {
      setQuery(value);
      setSelectedIndex(-1);

      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }

      if (value.trim().length >= 2) {
        setIsOpen(true);
        debounceRef.current = setTimeout(() => {
          performSearch(value).then();
        }, 300);
      } else {
        setResults([]);
        setSuggestion(undefined);
        setIsOpen(false);
      }
    },
    [performSearch]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!isOpen) return;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex((prev) => (prev < results.length - 1 ? prev + 1 : prev));
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
          break;
        case 'Escape':
          setIsOpen(false);
          setSelectedIndex(-1);
          break;
        case 'Enter':
          e.preventDefault();
          if (selectedIndex >= 0 && results[selectedIndex]) {
            window.location.href = `/product/${results[selectedIndex].slug}`;
          }
          break;
      }
    },
    [isOpen, results, selectedIndex]
  );

  const clearSearch = useCallback(() => {
    setQuery('');
    setResults([]);
    setSuggestion(undefined);
    setIsOpen(false);
    setSelectedIndex(-1);
  }, []);

  // ✅ Aplicar sugerencia
  const applySuggestion = useCallback(() => {
    if (suggestion) {
      handleInputChange(suggestion);
      setSuggestion(undefined);
    }
  }, [suggestion, handleInputChange]);

  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  return {
    query,
    results,
    loading,
    isOpen,
    selectedIndex,
    suggestion, // ✅ Exportar sugerencia
    setIsOpen,
    handleInputChange,
    handleKeyDown,
    clearSearch,
    applySuggestion, // ✅ Exportar función
  };
};
