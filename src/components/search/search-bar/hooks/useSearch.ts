import React, { useState, useCallback, useRef, useEffect } from 'react';
import { searchProducts, saveSearch } from '@/actions';
import { SearchResult } from '@/interfaces';
import { useSearchStore } from '@/store';

export const useSearch = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  // ✅ Corrección: inicializar con null
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const addSearch = useSearchStore((state) => state.addSearch);

  // Búsqueda con debounce
  const performSearch = useCallback(
    async (searchTerm: string) => {
      if (!searchTerm || searchTerm.trim().length < 2) {
        setResults([]);
        return;
      }

      setLoading(true);
      try {
        const { ok, results: searchResults, total } = await searchProducts(searchTerm, 10);

        if (ok) {
          setResults(searchResults);
          addSearch(searchTerm, total);

          // Guardar en BD para analytics
          saveSearch({ term: searchTerm, resultsCount: total }).catch((error) => {
            console.error('Error saving search to DB:', error);
          });
        }
      } catch (error) {
        console.error('Search error:', error);
        setResults([]);
      } finally {
        setLoading(false);
      }
    },
    [addSearch]
  );

  // Handle input change con debounce
  const handleInputChange = useCallback(
    (value: string) => {
      setQuery(value);
      setSelectedIndex(-1);

      // ✅ Verificar si existe antes de limpiar
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
        setIsOpen(false);
      }
    },
    [performSearch]
  );

  // Navegación con teclado
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

  // Limpiar búsqueda
  const clearSearch = useCallback(() => {
    setQuery('');
    setResults([]);
    setIsOpen(false);
    setSelectedIndex(-1);
  }, []);

  // Cleanup
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
    setIsOpen,
    handleInputChange,
    handleKeyDown,
    clearSearch,
  };
};
