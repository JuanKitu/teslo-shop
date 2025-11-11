import React from 'react';
import { IoTrashOutline } from 'react-icons/io5';
import { ProductImage } from '@/components';
import { getImageGridStyles } from '../styles';
import type { ImageGridProps } from '../image-uploader.interface';

export const ImageGrid: React.FC<ImageGridProps> = ({ images, onDelete, isDark }) => {
  const styles = getImageGridStyles(isDark);

  if (images.length === 0) return null;

  return (
    <div className={styles.container}>
      {images.map((url, index) => (
        <div key={url} className={styles.imageWrapper}>
          <ProductImage
            src={url}
            alt={`Imagen del producto ${index + 1}`}
            fill
            className={styles.image}
          />

          <button
            type="button"
            onClick={() => onDelete(url)}
            className={styles.deleteButton}
            aria-label={`Eliminar imagen ${index + 1}`}
            title="Eliminar imagen"
          >
            <IoTrashOutline className="w-5 h-5" />
          </button>

          {/* Badge de número de imagen */}
          <div className="absolute bottom-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
            {index + 1}
          </div>
        </div>
      ))}
    </div>
  );
};
