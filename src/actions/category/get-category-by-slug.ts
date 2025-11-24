// actions/category/get-category-by-slug.ts
'use server';

import prisma from '@/lib/prisma';

export async function getCategoryBySlug(slug: string) {
  try {
    return await prisma.category.findUnique({
      where: {
        slug,
        isActive: true,
        deletedAt: null,
      },
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        metaTitle: true,
        metaDescription: true,
        metaKeywords: true,
        children: {
          // ← NUEVO
          where: {
            isActive: true,
            deletedAt: null,
          },
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
    });
  } catch (error) {
    console.error('[getCategoryBySlug]', error);
    return null;
  }
}
