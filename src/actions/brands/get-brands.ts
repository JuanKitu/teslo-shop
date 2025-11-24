'use server';

import prisma from '@/lib/prisma';

export async function getBrands() {
  try {
    return await prisma.brand.findMany({
      where: {
        isActive: true,
        deletedAt: null,
      },
      select: {
        id: true,
        name: true,
        slug: true,
      },
      orderBy: [
        { isFeatured: 'desc' }, // Destacadas primero
        { order: 'asc' }, // Luego por orden
        { name: 'asc' }, // Alfabético como último criterio
      ],
    });
  } catch (error) {
    console.error('[getBrands]', error);
    return [];
  }
}
