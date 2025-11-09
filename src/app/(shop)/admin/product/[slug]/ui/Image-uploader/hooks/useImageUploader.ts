import { useState, useCallback } from 'react';
import { uploadImages, deleteProductImage } from '@/actions';
import type { ImageUploaderProps } from '../image-uploader.interface';

export const useImageUploader = ({ initialImages = [], onChange }: ImageUploaderProps) => {
  const [images, setImages] = useState<string[]>(initialImages.map((i) => i.url));
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
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
    [images, onChange]
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
  };
};
