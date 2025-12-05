'use client';

import React from 'react';
import clsx from 'clsx';
import { IoAddOutline, IoClose } from 'react-icons/io5';
import { ImageUploadField } from './ImageUploadField';

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  parentId: string | null;
  order: number;
  isActive: boolean;
  isHidden: boolean;
  isFeatured: boolean;
  createdAt: Date;
  updatedAt: Date;
  _count: {
    products: number;
    children: number;
  };
  media: Array<{
    id: string;
    url: string;
    isMain: boolean;
    alt: string | null;
  }>;
}

interface FormData {
  name: string;
  description: string;
  parentId: string;
  imageFile: File | null;
}

interface CategoryFormProps {
  formData: FormData;
  editingId: string | null;
  imagePreview: string | null;
  isSubmitting: boolean;
  categories: Category[];
  isDark: boolean;
  onFormChange: (data: Partial<FormData>) => void;
  onImageChange: (file: File, preview: string) => void;
  onImageRemove: () => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
}

export function CategoryForm({
  formData,
  editingId,
  imagePreview,
  isSubmitting,
  categories,
  isDark,
  onFormChange,
  onImageChange,
  onImageRemove,
  onSubmit,
  onCancel,
}: CategoryFormProps) {
  const handleImageFileChange = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      onImageChange(file, reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div
      className={clsx(
        'p-6 rounded-lg shadow-sm sticky top-6',
        isDark ? 'bg-[#1f1f1f]' : 'bg-white'
      )}
    >
      <div className="flex items-center justify-between mb-1">
        <h3 className={clsx('text-xl font-semibold', isDark ? 'text-white' : 'text-gray-900')}>
          {editingId ? 'Editar Categoría' : 'Nueva Categoría'}
        </h3>
        {editingId && (
          <button
            onClick={onCancel}
            className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <IoClose size={20} />
          </button>
        )}
      </div>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
        Completa los datos para {editingId ? 'actualizar' : 'crear'} una categoría.
      </p>

      <form onSubmit={onSubmit} className="space-y-4">
        {/* Name */}
        <div>
          <label
            htmlFor="category-name"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Nombre de la categoría
          </label>
          <input
            id="category-name"
            type="text"
            value={formData.name}
            onChange={(e) => onFormChange({ name: e.target.value })}
            placeholder="Ej: Remeras de verano"
            className={clsx(
              'w-full rounded-md border px-3 py-2 text-sm',
              'focus:outline-none focus:ring-2 focus:ring-blue-500',
              isDark ? 'border-gray-600 bg-[#1f1f1f] text-white' : 'border-gray-300 bg-white'
            )}
            required
          />
        </div>

        {/* Description */}
        <div>
          <label
            htmlFor="category-description"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Descripción (opcional)
          </label>
          <textarea
            id="category-description"
            value={formData.description}
            onChange={(e) => onFormChange({ description: e.target.value })}
            placeholder="Descripción de la categoría..."
            rows={3}
            className={clsx(
              'w-full rounded-md border px-3 py-2 text-sm',
              'focus:outline-none focus:ring-2 focus:ring-blue-500',
              isDark ? 'border-gray-600 bg-[#1f1f1f] text-white' : 'border-gray-300 bg-white'
            )}
          />
        </div>

        {/* Parent Category */}
        <div>
          <label
            htmlFor="parent-category"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Categoría padre (opcional)
          </label>
          <select
            id="parent-category"
            value={formData.parentId}
            onChange={(e) => onFormChange({ parentId: e.target.value })}
            className={clsx(
              'w-full rounded-md border px-3 py-2 text-sm',
              'focus:outline-none focus:ring-2 focus:ring-blue-500',
              isDark ? 'border-gray-600 bg-[#1f1f1f] text-white' : 'border-gray-300 bg-white'
            )}
          >
            <option value="">Ninguna</option>
            {categories
              .filter((c) => !c.parentId && c.id !== editingId)
              .map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
          </select>
        </div>

        {/* Image Upload */}
        <ImageUploadField
          imagePreview={imagePreview}
          isDark={isDark}
          onImageChange={handleImageFileChange}
          onImageRemove={onImageRemove}
        />

        {/* Buttons */}
        <div className="flex justify-end gap-3 pt-2">
          {editingId && (
            <button
              type="button"
              onClick={onCancel}
              className="btn-secondary"
              disabled={isSubmitting}
            >
              Cancelar
            </button>
          )}
          <button
            type="submit"
            className="btn-primary flex items-center gap-2"
            disabled={isSubmitting}
          >
            <IoAddOutline size={18} />
            {isSubmitting
              ? 'Guardando...'
              : editingId
                ? 'Actualizar Categoría'
                : 'Guardar Categoría'}
          </button>
        </div>
      </form>
    </div>
  );
}
