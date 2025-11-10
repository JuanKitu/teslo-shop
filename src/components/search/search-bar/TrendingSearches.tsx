import React from 'react';
import { IoTrendingUpOutline, IoTrendingDownOutline, IoRemoveOutline } from 'react-icons/io5';
import { getSearchBarStyles } from './styles';
import { TrendingSearch } from '@/interfaces';

interface Props {
  trending: TrendingSearch[];
  onSelect: (term: string) => void;
  isDark: boolean;
}

export const TrendingSearches: React.FC<Props> = ({ trending, onSelect, isDark }) => {
  const styles = getSearchBarStyles(isDark);

  if (trending.length === 0) return null;

  const getTrendIcon = (trend: TrendingSearch['trend']) => {
    switch (trend) {
      case 'up':
        return <IoTrendingUpOutline className={styles.trendIcon('up')} />;
      case 'down':
        return <IoTrendingDownOutline className={styles.trendIcon('down')} />;
      default:
        return <IoRemoveOutline className={styles.trendIcon('stable')} />;
    }
  };

  return (
    <div className={styles.section}>
      <div className={styles.sectionTitle}>🔥 Búsquedas populares</div>
      {trending.map((item, index) => (
        <div key={item.term} className={styles.trendingItem} onClick={() => onSelect(item.term)}>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-gray-400">#{index + 1}</span>
            <span className="capitalize">{item.term}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">{item.count}</span>
            {getTrendIcon(item.trend)}
          </div>
        </div>
      ))}
    </div>
  );
};
