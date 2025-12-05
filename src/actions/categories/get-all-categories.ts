'use server';

import prisma from '@/lib/prisma';

interface CategoryWithDetails {
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
  parent?: {
    id: string;
    name: string;
  } | null;
  children?: CategoryWithDetails[];
}

export async function getAllCategories(): Promise<CategoryWithDetails[]> {
  try {
    const categories = await prisma.category.findMany({
      where: {
        deletedAt: null,
      },
      orderBy: {
        order: 'asc',
      },
      include: {
        media: {
          select: {
            id: true,
            url: true,
            isMain: true,
            alt: true,
          },
          orderBy: {
            order: 'asc',
          },
        },
        parent: {
          select: {
            id: true,
            name: true,
          },
        },
        _count: {
          select: {
            products: true,
            children: true,
          },
        },
      },
    });

    return categories as CategoryWithDetails[];
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw new Error('No se pudieron obtener las categorías');
  }
}
