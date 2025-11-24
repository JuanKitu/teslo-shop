'use server';

import prisma from '@/lib/prisma';

export async function getPriceRange() {
  try {
    const result = await prisma.product.aggregate({
      where: {
        isActive: true,
        isHidden: false,
        deletedAt: null,
      },
      _min: {
        price: true,
      },
      _max: {
        price: true,
      },
    });

    return {
      ok: true,
      min: result._min.price || 0,
      max: result._max.price || 0,
    };
  } catch (error) {
    console.error('Error fetching price range:', error);
    return {
      ok: false,
      message: 'Error al obtener rango de precios',
      min: 0,
      max: 0,
    };
  }
}
