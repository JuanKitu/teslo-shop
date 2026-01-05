'use client';

import React from 'react';
import clsx from 'clsx';
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  defaultDropAnimationSideEffects,
  DropAnimation,
  rectIntersection,
} from '@dnd-kit/core';
import { CategoryItem } from './CategoryItem';
import { useCategoryHierarchy } from './hooks/useCategoryHierarchy';
import { useCategoryDrag } from './hooks/useCategoryDrag';
import { RootDropZone } from './components/RootDropZone';
import { CategoryTree } from './components/CategoryTree';

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
  onReorder: (categoryId: string, newOrder: number, newParentId?: string | null) => void;
}

const dropAnimation: DropAnimation = {
  sideEffects: defaultDropAnimationSideEffects({
    styles: {
      active: {
        opacity: '0.5',
      },
    },
  }),
};

export function CategoryList({
  categories,
  isDark,
  onEdit,
  onDelete,
  onReorder,
}: CategoryListProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor)
  );

  const { categoryMap, mainCategories, isDescendant } = useCategoryHierarchy(categories);

  const { activeId, activeCategory, handleDragStart, handleDragEnd } = useCategoryDrag({
    categories,
    categoryMap,
    mainCategories,
    isDescendant,
    onReorder,
  });

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={rectIntersection}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div
        className={clsx(
          'relative min-h-[500px] rounded-lg shadow-sm bg-gray-50/50 dark:bg-[#1f1f1f]',
          isDark ? 'text-white' : 'text-gray-900'
        )}
      >
        <RootDropZone isDragging={!!activeId} isDark={isDark}>
          <div className="relative z-10 w-full">
            {categories.length === 0 ? (
              <p className="p-8 text-center text-gray-500 dark:text-gray-400">
                No hay categorías disponibles
              </p>
            ) : (
              <CategoryTree
                categories={categories}
                categoryMap={categoryMap}
                parentId={null}
                level={0}
                isDark={isDark}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            )}
          </div>
        </RootDropZone>

        <DragOverlay dropAnimation={dropAnimation}>
          {activeCategory ? (
            <CategoryItem
              category={activeCategory}
              level={0}
              isDark={isDark}
              onEdit={() => {}}
              onDelete={() => {}}
              draggable
            />
          ) : null}
        </DragOverlay>
      </div>
    </DndContext>
  );
}
