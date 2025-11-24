'use server';

import prisma from '@/lib/prisma';

export async function getSizes() {
  try {
    const sizeOption = await prisma.variantOption.findFirst({
      where: {
        OR: [{ slug: 'size' }, { slug: 'talla' }],
        isFilterable: true,
      },
    });

    if (!sizeOption) {
      return {
        ok: true,
        sizes: [],
      };
    }

    const sizes = await prisma.variantOptionValue.findMany({
      where: {
        optionId: sizeOption.id,
        productVariant: {
          isActive: true,
          deletedAt: null,
          product: {
            isActive: true,
            deletedAt: null,
          },
        },
      },
      select: {
        value: true,
      },
      distinct: ['value'],
    });

    // Ordenar tallas (XS, S, M, L, XL, XXL)
    const sizeOrder = ['XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'];
    const sortedSizes = sizes
      .map((s) => s.value)
      .sort((a, b) => {
        const indexA = sizeOrder.indexOf(a.toUpperCase());
        const indexB = sizeOrder.indexOf(b.toUpperCase());
        if (indexA === -1) return 1;
        if (indexB === -1) return -1;
        return indexA - indexB;
      });

    return {
      ok: true,
      sizes: sortedSizes,
    };
  } catch (error) {
    console.error('Error fetching sizes:', error);
    return {
      ok: false,
      message: 'Error al obtener tallas',
      sizes: [],
    };
  }
}
