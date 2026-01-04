'use client';

import React from 'react';
import clsx from 'clsx';
import { MdDragIndicator, MdEdit, MdDelete } from 'react-icons/md';
import { IoImageOutline } from 'react-icons/io5';
import { ProductImage } from '@/components';
import { useDraggable, useDroppable } from '@dnd-kit/core';

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
  draggable?: boolean;
}

export const CategoryItem = React.memo<CategoryItemProps>(
  ({ category, level, isDark, onEdit, onDelete, draggable = false }) => {
    const mainImage = category.media.find((m) => m.isMain);
    void level;
    const {
      attributes,
      listeners,
      setNodeRef: setDragRef,
      isDragging,
    } = useDraggable({
      id: category.id,
      disabled: !draggable,
    });

    const { setNodeRef: setDropRef, isOver } = useDroppable({
      id: `drop-${category.id}`,
    });

    const setRefs = React.useCallback(
      (node: HTMLDivElement | null) => {
        setDragRef(node);
        setDropRef(node);
      },
      [setDragRef, setDropRef]
    );

    const handleEdit = React.useCallback(() => onEdit(category), [onEdit, category]);
    const handleDelete = React.useCallback(() => onDelete(category.id), [onDelete, category.id]);

    return (
      <div
        ref={setRefs}
        className={clsx(
          'group flex items-center p-3 rounded-lg transition-all',
          isDark ? 'bg-[#2a2a2a] hover:bg-[#333]' : 'bg-gray-50 hover:bg-gray-100',
          isDragging && 'opacity-40 grayscale',
          isOver && !isDragging && 'ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-900/20'
        )}
      >
        {draggable && (
          <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing p-1">
            <MdDragIndicator
              className={clsx(
                'mr-2',
                isDark
                  ? 'text-gray-500 group-hover:text-gray-300'
                  : 'text-gray-400 group-hover:text-gray-600'
              )}
              size={20}
            />
          </div>
        )}

        <div className="w-10 h-10 rounded-md mr-4 flex-shrink-0 overflow-hidden bg-white dark:bg-gray-800">
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

        <div className="flex-grow min-w-0">
          <p className={clsx('font-medium truncate', isDark ? 'text-white' : 'text-gray-900')}>
            {category.name}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
            {category._count.products} prod • {category._count.children} sub
          </p>
        </div>

        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={handleEdit}
            className={clsx(
              'p-2 rounded-md transition-colors',
              isDark ? 'hover:bg-gray-600 text-gray-300' : 'hover:bg-gray-200 text-gray-600'
            )}
            title="Editar"
            type="button"
          >
            <MdEdit size={16} />
          </button>
          <button
            onClick={handleDelete}
            className="p-2 rounded-md hover:bg-red-100 dark:hover:bg-red-900/30 text-red-500 transition-colors"
            title="Eliminar"
            type="button"
          >
            <MdDelete size={16} />
          </button>
        </div>
      </div>
    );
  }
);

CategoryItem.displayName = 'CategoryItem';
