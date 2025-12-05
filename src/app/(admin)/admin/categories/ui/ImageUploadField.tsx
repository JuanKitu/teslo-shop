'use client';

import React from 'react';
import clsx from 'clsx';
import { IoImageOutline } from 'react-icons/io5';

interface ImageUploadFieldProps {
  imagePreview: string | null;
  isDark: boolean;
  onImageChange: (file: File) => void;
  onImageRemove: () => void;
}

export function ImageUploadField({
  imagePreview,
  isDark,
  onImageChange,
  onImageRemove,
}: ImageUploadFieldProps) {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImageChange(file);
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        Imagen de la categoría
      </label>
      <div
        className={clsx(
          'mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md',
          isDark ? 'border-gray-600' : 'border-gray-300'
        )}
      >
        {imagePreview ? (
          <div className="space-y-2 text-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imagePreview}
              alt="Preview"
              className="mx-auto h-32 w-32 object-cover rounded-md"
            />
            <button
              type="button"
              onClick={onImageRemove}
              className="text-xs text-red-500 hover:text-red-700"
            >
              Eliminar
            </button>
          </div>
        ) : (
          <div className="space-y-1 text-center">
            <IoImageOutline className="mx-auto h-12 w-12 text-gray-400" />
            <div className="flex text-sm text-gray-600 dark:text-gray-400">
              <label
                htmlFor="file-upload"
                className={clsx(
                  'relative cursor-pointer rounded-md font-medium',
                  'text-blue-600 hover:text-blue-500 focus-within:outline-none'
                )}
              >
                <span>Sube un archivo</span>
                <input
                  id="file-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="sr-only"
                />
              </label>
              <p className="pl-1">o arrastra y suelta</p>
            </div>
            <p className="text-xs text-gray-500">PNG, JPG, GIF hasta 10MB</p>
          </div>
        )}
      </div>
    </div>
  );
}
