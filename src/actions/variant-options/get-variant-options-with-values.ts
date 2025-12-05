'use server';

import prisma from '@/lib/prisma';

/**
 * Obtiene todas las opciones de variantes con sus valores globales
 * Para usar en el formulario de productos
 */
export async function getVariantOptionsWithValues() {
  try {
    const options = await prisma.variantOption.findMany({
      select: {
        id: true,
        name: true,
        slug: true,
        type: true,
        description: true,
        placeholder: true,
        isRequired: true,
        isFilterable: true,
        position: true,
        globalValues: {
          select: {
            id: true,
            value: true,
            colorHex: true,
            order: true,
          },
          orderBy: {
            order: 'asc',
          },
        },
      },
      orderBy: {
        position: 'asc',
      },
    });

    return {
      ok: true,
      options,
    };
  } catch (error) {
    console.error('[getVariantOptionsWithValues]', error);
    return {
      ok: false,
      options: [],
      error: 'Error al obtener opciones de variantes',
    };
  }
}
