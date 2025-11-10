import React from 'react';
import Link from 'next/link';
import { ProductImage } from '@/components';
import { ProductBadge } from './ProductBadge';
import { getSearchBarStyles } from './styles';
import { SearchResult } from '@/interfaces';

interface Props {
  results: SearchResult[];
  selectedIndex: number;
  onClose: () => void;
  isDark: boolean;
}

export const SearchResults: React.FC<Props> = ({ results, selectedIndex, onClose, isDark }) => {
  const styles = getSearchBarStyles(isDark);

  if (results.length === 0) return null;

  return (
    <div className={styles.section}>
      <div className={styles.sectionTitle}>Productos ({results.length})</div>
      {results.map((result, index) => (
        <Link
          key={result.id}
          href={`/product/${result.slug}`}
          className={styles.resultItem(selectedIndex === index)}
          onClick={onClose}
        >
          {/* Imagen */}
          <div className="relative w-12 h-12 flex-shrink-0 rounded-md overflow-hidden">
            <ProductImage
              src={result.image}
              alt={result.title}
              fill
              adaptiveBackground="light"
              className="object-cover"
            />
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h4 className="font-medium truncate">{result.title}</h4>
              {result.badge && <ProductBadge type={result.badge} isDark={isDark} />}
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="font-bold">${result.price}</span>
              <span className="text-xs text-gray-500">
                {result.stock > 0 ? `Stock: ${result.stock}` : 'Sin stock'}
              </span>
            </div>
          </div>

          {/* Categoría */}
          <div className="text-xs text-gray-500 capitalize">{result.category}</div>
        </Link>
      ))}
    </div>
  );
};
