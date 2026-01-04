import React from 'react';
import clsx from 'clsx';
import { CategoryItem } from '../CategoryItem';

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

interface CategoryTreeProps {
  categories: Category[];
  categoryMap: Map<string, Category[]>;
  parentId: string | null;
  level: number;
  isDark: boolean;
  onEdit: (category: Category) => void;
  onDelete: (categoryId: string) => void;
}

/**
 * Recursive component to render category tree with indentation
 */
export const CategoryTree = React.memo<CategoryTreeProps>(
  ({ categories, categoryMap, parentId, level, isDark, onEdit, onDelete }) => {
    const groupCategories = parentId
      ? categoryMap.get(parentId) || []
      : categories.filter((c) => !c.parentId).sort((a, b) => a.order - b.order);

    if (groupCategories.length === 0) return null;

    return (
      <div
        className={clsx(
          'space-y-2',
          level > 0 && 'pl-8 ml-2 border-l-2 border-gray-100 dark:border-gray-700'
        )}
      >
        {groupCategories.map((category) => {
          const children = categoryMap.get(category.id) || [];

          return (
            <div key={category.id}>
              <CategoryItem
                category={category}
                level={level}
                isDark={isDark}
                onEdit={onEdit}
                onDelete={onDelete}
                draggable
              />

              {children.length > 0 && (
                <CategoryTree
                  categories={categories}
                  categoryMap={categoryMap}
                  parentId={category.id}
                  level={level + 1}
                  isDark={isDark}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              )}
            </div>
          );
        })}
      </div>
    );
  }
);

CategoryTree.displayName = 'CategoryTree';
