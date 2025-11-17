// ImageUploader.tsx

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

export function ImageUploader({
  initialImages = [],
  onChange,
  maxImages = 10,
}: ImageUploaderProps) {
  const [mounted, setMounted] = useState(false);
  const { theme } = useTheme();

  const { images, uploading, error, onDrop, handleDelete, hasReachedLimit } = useImageUploader({
    initialImages,
    onChange,
    maxImages,
  });

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/png': ['.png'],
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/webp': ['.webp'],
    },
    maxSize: 5 * 1024 * 1024, // 5MB
    disabled: uploading || hasReachedLimit, // 🆕 Deshabilitar si alcanzó el límite
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
      <div className="mb-4">
        <h3 className="text-lg font-semibold">Imágenes del Producto</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          {images.length} / {maxImages} imágenes
        </p>
      </div>

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

      {/* Mensaje de límite alcanzado */}
      {hasReachedLimit && (
        <div
          className={clsx(
            'mb-4 p-3 rounded-md text-sm border',
            isDark
              ? 'bg-yellow-950/20 border-yellow-900 text-yellow-400'
              : 'bg-yellow-50 border-yellow-200 text-yellow-600'
          )}
        >
          Has alcanzado el límite de {maxImages} imágenes. Elimina alguna para subir más.
        </div>
      )}

      {/* DropZone - Solo mostrar si no alcanzó el límite */}
      {!hasReachedLimit && (
        <DropZone
          isDragActive={isDragActive}
          getRootProps={getRootProps}
          getInputProps={getInputProps}
          isDark={isDark}
          disabled={uploading}
        />
      )}

      {/* Loading Spinner */}
      {uploading && <LoadingSpinner isDark={isDark} />}

      {/* Grid de Imágenes */}
      <ImageGrid images={images} onDelete={handleDelete} isDark={isDark} />

      {/* Footer info */}
      {images.length === 0 && !uploading && (
        <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-4">
          No hay imágenes cargadas
        </p>
      )}
    </div>
  );
}
