import React from 'react';
import { IoCloseOutline, IoTimeOutline } from 'react-icons/io5';
import { getSearchBarStyles } from './styles';
import { RecentSearch } from '@/interfaces';

interface Props {
  searches: RecentSearch[];
  onSelect: (term: string) => void;
  onRemove: (term: string) => void;
  onClearAll: () => void;
  isDark: boolean;
}

export const RecentSearches: React.FC<Props> = ({
  searches,
  onSelect,
  onRemove,
  onClearAll,
  isDark,
}) => {
  const styles = getSearchBarStyles(isDark);

  if (searches.length === 0) return null;

  const formatTime = (timestamp: number) => {
    const diff = Date.now() - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 60) return `Hace ${minutes}m`;
    if (hours < 24) return `Hace ${hours}h`;
    return `Hace ${days}d`;
  };

  return (
    <div className={styles.section}>
      <div className="flex items-center justify-between px-4 py-2">
        <div className={styles.sectionTitle}>Búsquedas recientes</div>
        <button
          onClick={onClearAll}
          className="text-xs text-blue-500 hover:text-blue-600 transition-colors"
        >
          Limpiar todo
        </button>
      </div>
      {searches.map((search) => (
        <div key={search.term} className={styles.recentItem}>
          <div className="flex items-center gap-2 flex-1" onClick={() => onSelect(search.term)}>
            <IoTimeOutline className="w-4 h-4 text-gray-400" />
            <span className="capitalize">{search.term}</span>
            <span className="text-xs text-gray-500">({search.resultsCount})</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400">{formatTime(search.timestamp)}</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onRemove(search.term);
              }}
              className="opacity-0 group-hover:opacity-100 transition-opacity p-1"
              aria-label={`Eliminar ${search.term}`}
            >
              <IoCloseOutline className="w-4 h-4 text-gray-400 hover:text-red-500" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};
