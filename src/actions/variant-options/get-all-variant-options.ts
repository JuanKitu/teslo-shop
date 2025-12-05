'use server';

import prisma from '@/lib/prisma';

export async function getAllVariantOptions() {
  try {
    return await prisma.variantOption.findMany({
      orderBy: {
        position: 'asc',
      },
      include: {
        globalValues: {
          where: {
            isActive: true,
          },
          orderBy: {
            order: 'asc',
          },
        },
        variantValues: {
          select: {
            id: true,
            value: true,
            variantId: true,
          },
        },
        _count: {
          select: {
            productOptions: true,
            variantValues: true,
            globalValues: true,
          },
        },
      },
    });
  } catch (error) {
    console.error('Error fetching variant options:', error);
    throw new Error('No se pudieron obtener las opciones de variante');
  }
}
