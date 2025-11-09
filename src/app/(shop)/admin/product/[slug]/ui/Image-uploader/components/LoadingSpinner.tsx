import React from 'react';
import { getLoadingSpinnerStyles } from '../styles';
import type { LoadingSpinnerProps } from '../image-uploader.interface';

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ isDark }) => {
  const styles = getLoadingSpinnerStyles(isDark);

  return (
    <div className={styles.container}>
      <div className={styles.spinner} />
      <p className={styles.text}>Subiendo imágenes...</p>
    </div>
  );
};
