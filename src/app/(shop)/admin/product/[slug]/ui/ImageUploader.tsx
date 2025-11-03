'use client';

import React, { useState } from 'react';
import { uploadImages, deleteProductImage } from '@/actions';
import { ProductImage as IProductImage } from '@/interfaces';
import { ProductImage } from '@/components';

interface Props {
  initialImages?: IProductImage[];
  onChange: (urls: string[]) => void;
}

export default function ImageUploader({ initialImages = [], onChange }: Props) {
  const [images, setImages] = useState<string[]>(initialImages.map((i) => i.url));
  const [uploading, setUploading] = useState(false);

  async function handleSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files?.length) return;

    setUploading(true);
    try {
      const uploadedUrls = await uploadImages(Array.from(files));
      const newImages = [...images, ...uploadedUrls];
      setImages(newImages);
      onChange(newImages); // avisás al form
    } finally {
      setUploading(false);
    }
  }

  async function handleDelete(url: string) {
    // actualizar el estado local inmediatamente
    setImages((prev) => prev.filter((i) => i !== url));
    onChange(images.filter((i) => i !== url));

    // delegar la lógica al server
    await deleteProductImage(url);
  }

  return (
    <div className="bg-white rounded-2xl shadow p-6 border border-gray-200">
      <h2 className="text-lg font-semibold mb-4">Imágenes</h2>
      <input
        type="file"
        multiple
        accept="image/png,image/jpeg"
        onChange={handleSelect}
        disabled={uploading}
        className="p-2 border rounded-md bg-gray-50 w-full"
      />

      {uploading && <p className="text-sm text-gray-500 mt-2">Subiendo imágenes...</p>}

      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4">
          {images.map((url) => (
            <div key={url} className="relative aspect-square overflow-hidden rounded-md shadow-sm">
              <ProductImage
                src={url}
                alt="imagen del producto"
                fill // usa fill en lugar de width/height
                className="object-cover"
              />
              <button
                type="button"
                onClick={() => handleDelete(url)}
                className="absolute bottom-0 left-0 right-0 bg-red-600 text-white text-sm py-1 rounded-b-md hover:bg-red-700"
              >
                Eliminar
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
