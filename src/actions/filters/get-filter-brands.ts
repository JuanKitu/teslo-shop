'use server';

import prisma from '@/lib/prisma';

export async function getFilterBrands() {
  try {
    const brands = await prisma.brand.findMany({
      where: {
        isActive: true,
        isHidden: false,
        deletedAt: null,
        products: {
          some: {
            product: {
              isActive: true,
              deletedAt: null,
            },
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
      select: {
        id: true,
        name: true,
        slug: true,
        _count: {
          select: {
            products: true,
          },
        },
      },
    });

    return {
      ok: true,
      brands: brands.map((brand) => ({
        id: brand.id,
        name: brand.name,
        slug: brand.slug,
        productCount: brand._count.products,
      })),
    };
  } catch (error) {
    console.error('Error fetching brands:', error);
    return {
      ok: false,
      message: 'Error al obtener marcas',
      brands: [],
    };
  }
}
