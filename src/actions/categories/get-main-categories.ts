'use server';

import prisma from '@/lib/prisma';

/**
 * Obtiene categorías principales para el menú
 * (sin parent, destacadas o las primeras N)
 */
export async function getMainCategories(limit: number = 5) {
  try {
    return await prisma.category.findMany({
      where: {
        isActive: true,
        isHidden: false,
        deletedAt: null,
        parentId: null, // Solo categorías principales
      },
      select: {
        id: true,
        name: true,
        slug: true,
        order: true,
        isFeatured: true,
      },
      orderBy: [
        { isFeatured: 'desc' }, // Destacadas primero
        { order: 'asc' }, // Luego por orden
        { name: 'asc' }, // Alfabético como último criterio
      ],
      take: limit,
    });
  } catch (error) {
    console.error('[getMainCategories]', error);
    return [];
  }
}
