'use client';

import React from 'react';
import clsx from 'clsx';
import { MdDragIndicator, MdEdit, MdDelete } from 'react-icons/md';
import { IoImageOutline } from 'react-icons/io5';
import { ProductImage } from '@/components';

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

interface CategoryItemProps {
  category: Category;
  level: number;
  isDark: boolean;
  onEdit: (category: Category) => void;
  onDelete: (categoryId: string) => void;
}

export function CategoryItem({ category, level, isDark, onEdit, onDelete }: CategoryItemProps) {
  const mainImage = category.media.find((m) => m.isMain);

  return (
    <div
      className={clsx(
        'group flex items-center p-3 rounded-lg transition-colors',
        isDark ? 'bg-[#2a2a2a] hover:bg-[#333]' : 'bg-gray-50 hover:bg-gray-100',
        level > 0 && 'ml-8'
      )}
    >
      <MdDragIndicator
        className={clsx(
          'mr-3 cursor-grab',
          isDark
            ? 'text-gray-500 group-hover:text-gray-300'
            : 'text-gray-400 group-hover:text-gray-600'
        )}
        size={20}
      />

      <div className="w-10 h-10 rounded-md mr-4 flex-shrink-0 overflow-hidden">
        {mainImage ? (
          <ProductImage
            src={mainImage.url}
            alt={category.name}
            className="w-full h-full object-cover"
            width={40}
            height={40}
          />
        ) : (
          <div
            className={clsx(
              'w-full h-full flex items-center justify-center',
              isDark ? 'bg-gray-700' : 'bg-gray-200'
            )}
          >
            <IoImageOutline className="text-gray-400" size={20} />
          </div>
        )}
      </div>

      <div className="flex-grow">
        <p className={clsx('font-medium', isDark ? 'text-white' : 'text-gray-900')}>
          {category.name}
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {category._count.products} producto{category._count.products !== 1 ? 's' : ''}
        </p>
      </div>

      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={() => onEdit(category)}
          className={clsx(
            'p-2 rounded-md transition-colors',
            isDark ? 'hover:bg-gray-600 text-gray-300' : 'hover:bg-gray-200 text-gray-600'
          )}
        >
          <MdEdit size={18} />
        </button>
        <button
          onClick={() => onDelete(category.id)}
          className="p-2 rounded-md hover:bg-red-100 dark:hover:bg-red-900/30 text-red-500 transition-colors"
        >
          <MdDelete size={18} />
        </button>
      </div>
    </div>
  );
}
