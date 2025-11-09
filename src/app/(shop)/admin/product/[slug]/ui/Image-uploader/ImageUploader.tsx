'use client';

import React, { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { useDropzone } from 'react-dropzone';
import clsx from 'clsx';
import { useImageUploader } from './hooks/useImageUploader';
import { DropZone } from './components/DropZone';
import { ImageGrid } from './components/ImageGrid';
import { LoadingSpinner } from './components/LoadingSpinner';
import { getImageUploaderStyles } from './styles';
import type { ImageUploaderProps } from './image-uploader.interface';

export function ImageUploader({ initialImages = [], onChange }: ImageUploaderProps) {
  const [mounted, setMounted] = useState(false);
  const { theme } = useTheme();

  const { images, uploading, error, onDrop, handleDelete } = useImageUploader({
    initialImages,
    onChange,
  });

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/png': ['.png'],
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/webp': ['.webp'],
    },
    maxSize: 5 * 1024 * 1024, // 5MB
    disabled: uploading,
    multiple: true,
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  // Evitar problemas de hidratación
  if (!mounted) {
    const styles = getImageUploaderStyles(false);
    return <div className={styles.skeleton} />;
  }

  const isDark = theme === 'dark';
  const styles = getImageUploaderStyles(isDark);

  return (
    <div className={styles.card}>
      {/* Header */}

      {/* Mensaje de error */}
      {error && (
        <div
          className={clsx(
            'mb-4 p-3 rounded-md text-sm border',
            isDark
              ? 'bg-red-950/20 border-red-900 text-red-400'
              : 'bg-red-50 border-red-200 text-red-600'
          )}
        >
          {error}
        </div>
      )}

      {/* DropZone */}
      <DropZone
        isDragActive={isDragActive}
        getRootProps={getRootProps}
        getInputProps={getInputProps}
        isDark={isDark}
        disabled={uploading}
      />

      {/* Mensaje de límite alcanzado */}
      {/* Loading Spinner */}
      {uploading && <LoadingSpinner isDark={isDark} />}

      {/* Grid de Imágenes */}
      <ImageGrid images={images} onDelete={handleDelete} isDark={isDark} />

      {/* Footer info */}
    </div>
  );
}
