'use server';

import prisma from '@/lib/prisma';

export async function getColors() {
  try {
    // Buscar la opción de color
    const colorOption = await prisma.variantOption.findFirst({
      where: {
        slug: 'color',
        isFilterable: true,
      },
    });

    if (!colorOption) {
      return {
        ok: true,
        colors: [],
      };
    }

    // Obtener todos los colores únicos
    const colors = await prisma.variantOptionValue.findMany({
      where: {
        optionId: colorOption.id,
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

    return {
      ok: true,
      colors: colors.map((c) => c.value),
    };
  } catch (error) {
    console.error('Error fetching colors:', error);
    return {
      ok: false,
      message: 'Error al obtener colores',
      colors: [],
    };
  }
}
