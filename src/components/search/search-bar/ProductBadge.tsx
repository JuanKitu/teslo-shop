import React from 'react';
import { getSearchBarStyles } from './styles';

interface Props {
  type: 'new' | 'bestseller' | 'trending';
  isDark: boolean;
}

const BADGE_LABELS = {
  new: 'Nuevo',
  bestseller: 'Más vendido',
  trending: 'Tendencia',
};

export const ProductBadge: React.FC<Props> = ({ type, isDark }) => {
  const styles = getSearchBarStyles(isDark);

  return <span className={styles.badge(type)}>{BADGE_LABELS[type]}</span>;
};
