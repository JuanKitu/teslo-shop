'use client';

import React from 'react';
import clsx from 'clsx';
import { CategoryItem } from './CategoryItem';

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

interface CategoryListProps {
  categories: Category[];
  isDark: boolean;
  onEdit: (category: Category) => void;
  onDelete: (categoryId: string) => void;
}

export function CategoryList({ categories, isDark, onEdit, onDelete }: CategoryListProps) {
  // Build category map for children
  const categoryMap = new Map<string, Category[]>();
  categories.forEach((cat) => {
    if (cat.parentId) {
      if (!categoryMap.has(cat.parentId)) {
        categoryMap.set(cat.parentId, []);
      }
      categoryMap.get(cat.parentId)!.push(cat);
    }
  });

  const mainCategories = categories.filter((c) => !c.parentId);

  const renderCategory = (category: Category, level: number = 0): React.ReactNode => {
    const children = categoryMap.get(category.id) || [];

    return (
      <div key={category.id}>
        <CategoryItem
          category={category}
          level={level}
          isDark={isDark}
          onEdit={onEdit}
          onDelete={onDelete}
        />

        {children.length > 0 && (
          <div className="mt-2 space-y-2">
            {children.map((child) => renderCategory(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={clsx('rounded-lg shadow-sm p-4', isDark ? 'bg-[#1f1f1f]' : 'bg-white')}>
      {categories.length === 0 ? (
        <p className="p-8 text-center text-gray-500 dark:text-gray-400">
          No hay categorías disponibles
        </p>
      ) : (
        <div className="space-y-2">
          {mainCategories.map((category) => renderCategory(category))}
        </div>
      )}
    </div>
  );
}
