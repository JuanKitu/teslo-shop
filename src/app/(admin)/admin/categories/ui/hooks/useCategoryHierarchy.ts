import { useMemo } from 'react';

interface Category {
  id: string;
  parentId: string | null;
  order: number;
}

/**
 * Custom hook to build and memoize category hierarchy
 */
export function useCategoryHierarchy<T extends Category>(categories: T[]) {
  const categoryMap = useMemo(() => {
    const map = new Map<string, T[]>();

    categories.forEach((cat) => {
      if (cat.parentId) {
        if (!map.has(cat.parentId)) {
          map.set(cat.parentId, []);
        }
        map.get(cat.parentId)!.push(cat);
      }
    });

    // Sort children by order
    map.forEach((children) => {
      children.sort((a, b) => a.order - b.order);
    });

    return map;
  }, [categories]);

  const mainCategories = useMemo(
    () => categories.filter((c) => !c.parentId).sort((a, b) => a.order - b.order),
    [categories]
  );

  const isDescendant = useMemo(
    () =>
      (parentId: string, targetId: string): boolean => {
        const children = categoryMap.get(parentId) || [];
        if (children.some((c) => c.id === targetId)) return true;
        return children.some((c) => isDescendant(c.id, targetId));
      },
    [categoryMap]
  );

  return { categoryMap, mainCategories, isDescendant };
}
