// hooks/useImageUploader.ts

import { useState, useCallback } from 'react';
import { uploadImages, deleteProductImage } from '@/actions';
import type { ImageUploaderProps, InitialImage } from '../image-uploader.interface';

/**
 * Helper para normalizar imágenes a string[]
 */
const normalizeImages = (images: InitialImage[]): string[] => {
  return images.map((img) => {
    if (typeof img === 'string') {
      return img;
    }
    return img.url;
  });
};

export const useImageUploader = ({
  initialImages = [],
  onChange,
  maxImages = 10,
}: ImageUploaderProps) => {
  const [images, setImages] = useState<string[]>(normalizeImages(initialImages));
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      // Validar límite de imágenes
      if (maxImages && images.length + acceptedFiles.length > maxImages) {
        setError(`Solo puedes subir un máximo de ${maxImages} imágenes.`);
        setTimeout(() => setError(null), 3000);
        return;
      }

      setUploading(true);
      setError(null);

      try {
        const uploadedUrls = await uploadImages(acceptedFiles);
        const newImages = [...images, ...uploadedUrls];
        setImages(newImages);
        onChange(newImages);
      } catch (err) {
        console.error('Error al subir imágenes:', err);
        setError('Error al subir las imágenes. Intenta nuevamente.');
        setTimeout(() => setError(null), 3000);
      } finally {
        setUploading(false);
      }
    },
    [images, onChange, maxImages]
  );

  const handleDelete = useCallback(
    async (url: string) => {
      const newImages = images.filter((i) => i !== url);
      setImages(newImages);
      onChange(newImages);

      try {
        await deleteProductImage(url);
      } catch (err) {
        console.error('Error al eliminar imagen:', err);
        setError('Error al eliminar la imagen.');
        setTimeout(() => setError(null), 3000);
        // Revertir en caso de error
        setImages(images);
        onChange(images);
      }
    },
    [images, onChange]
  );

  return {
    images,
    uploading,
    error,
    onDrop,
    handleDelete,
    hasReachedLimit: maxImages ? images.length >= maxImages : false, // 🆕 Helper
  };
};
