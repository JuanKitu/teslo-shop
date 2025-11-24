'use server';

import prisma from '@/lib/prisma';

export async function getBrandBySlug(slug: string) {
  try {
    return await prisma.brand.findUnique({
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
      },
    });
  } catch (error) {
    console.error('[getBrandBySlug]', error);
    return null;
  }
}
