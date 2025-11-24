'use server';
import prisma from '@/lib/prisma';

export async function getCategories() {
  try {
    return await prisma.category.findMany({
      where: {
        isActive: true,
        deletedAt: null,
      },
      select: {
        id: true,
        name: true,
        slug: true,
      },
      orderBy: {
        name: 'asc',
      },
    });
  } catch (error) {
    console.error('[getCategories]', error);
    return [];
  }
}
