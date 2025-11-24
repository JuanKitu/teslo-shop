'use server';

import prisma from '@/lib/prisma';

interface CategoryTree {
  id: string;
  name: string;
  slug: string;
  parentId: string | null;
  order: number;
  isFeatured: boolean;
  children: CategoryTree[];
}

export async function getCategoryTree() {
  try {
    const categories = await prisma.category.findMany({
      where: {
        isActive: true,
        isHidden: false,
        deletedAt: null,
      },
      orderBy: {
        order: 'asc',
      },
      select: {
        id: true,
        name: true,
        slug: true,
        parentId: true,
        order: true,
        isFeatured: true,
      },
    });

    // Construir árbol jerárquico
    const categoryMap = new Map<string, CategoryTree>();
    const rootCategories: CategoryTree[] = [];

    // Primera pasada: crear el mapa
    categories.forEach((cat) => {
      categoryMap.set(cat.id, { ...cat, children: [] });
    });

    // Segunda pasada: construir jerarquía
    categories.forEach((cat) => {
      const category = categoryMap.get(cat.id);
      if (!category) return;

      if (cat.parentId) {
        const parent = categoryMap.get(cat.parentId);
        if (parent) {
          parent.children.push(category);
        }
      } else {
        rootCategories.push(category);
      }
    });

    return {
      ok: true,
      categories: rootCategories,
    };
  } catch (error) {
    console.error('Error fetching category tree:', error);
    return {
      ok: false,
      message: 'Error al obtener árbol de categorías',
      categories: [] as CategoryTree[],
    };
  }
}
