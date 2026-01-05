import { useState, useCallback } from 'react';
import { DragEndEvent, DragStartEvent } from '@dnd-kit/core';

interface Category {
  id: string;
  parentId: string | null;
}

interface UseCategoryDragParams<T extends Category> {
  categories: T[];
  categoryMap: Map<string, T[]>;
  mainCategories: T[];
  isDescendant: (parentId: string, targetId: string) => boolean;
  onReorder: (categoryId: string, newOrder: number, newParentId?: string | null) => void;
}

/**
 * Custom hook to handle category drag & drop logic
 */
export function useCategoryDrag<T extends Category>({
  categories,
  categoryMap,
  mainCategories,
  isDescendant,
  onReorder,
}: UseCategoryDragParams<T>) {
  const [activeId, setActiveId] = useState<string | null>(null);

  const handleDragStart = useCallback((event: DragStartEvent) => {
    setActiveId(String(event.active.id));
  }, []);

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      setActiveId(null);
      const { active, over } = event;

      if (!over || active.id === over.id) return;

      const activeCategory = categories.find((c) => c.id === active.id);
      if (!activeCategory) return;

      const overIdStr = String(over.id);

      // Case 1: Drop on Root Zone (Promote)
      if (overIdStr === 'root-drop-zone') {
        if (!activeCategory.parentId) return;
        const newOrder = mainCategories.length;
        onReorder(activeCategory.id, newOrder, null);
        return;
      }

      // Case 2: Drop on another category
      const isDropZone = overIdStr.startsWith('drop-');

      if (isDropZone) {
        const targetCategoryId = overIdStr.replace('drop-', '');

        if (targetCategoryId === activeCategory.id) return;

        if (isDescendant(activeCategory.id, targetCategoryId)) {
          alert('No puedes mover una categoría dentro de su propia subcategoría');
          return;
        }

        const targetCategory = categories.find((c) => c.id === targetCategoryId);
        if (!targetCategory) return;

        if (activeCategory.id === targetCategory.parentId) {
          alert('No se puede crear jerarquía circular');
          return;
        }

        const newChildren = categoryMap.get(targetCategory.id) || [];
        const newOrder = newChildren.length;

        onReorder(activeCategory.id, newOrder, targetCategory.id);
      } else {
        const overCategory = categories.find((c) => c.id === over.id);
        if (!overCategory) return;

        if (activeCategory.parentId === overCategory.parentId) {
          const siblings = activeCategory.parentId
            ? categoryMap.get(activeCategory.parentId) || []
            : mainCategories;

          const oldIndex = siblings.findIndex((c) => c.id === active.id);
          const newIndex = siblings.findIndex((c) => c.id === over.id);

          if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
            onReorder(activeCategory.id, newIndex, activeCategory.parentId);
          }
        }
      }
    },
    [categories, categoryMap, mainCategories, isDescendant, onReorder]
  );

  const activeCategory = activeId ? categories.find((c) => c.id === activeId) : null;

  return {
    activeId,
    activeCategory,
    handleDragStart,
    handleDragEnd,
  };
}
