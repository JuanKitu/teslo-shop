'use server';

import prisma from '@/lib/prisma';

export async function getCategoriesBar() {
  try {
    const categories = await prisma.category.findMany({
      where: {
        isActive: true,
        isHidden: false,
        deletedAt: null,
        parentId: null, // Solo categorías principales
      },
      orderBy: {
        order: 'asc',
      },
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        order: true,
        isFeatured: true,
        children: {
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
            description: true,
            order: true,
            isFeatured: true,
          },
        },
      },
    });

    return {
      ok: true,
      categories: categories.map((cat) => ({
        ...cat,
        subcategories: cat.children,
      })),
    };
  } catch (error) {
    console.error('Error fetching categories:', error);
    return {
      ok: false,
      message: 'Error al obtener categorías',
      categories: [],
    };
  }
}
