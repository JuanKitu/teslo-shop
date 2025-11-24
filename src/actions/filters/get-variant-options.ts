'use server';

import prisma from '@/lib/prisma';

export async function getVariantOptions() {
  try {
    const options = await prisma.variantOption.findMany({
      where: {
        isFilterable: true,
      },
      orderBy: {
        position: 'asc',
      },
      select: {
        id: true,
        name: true,
        slug: true,
        type: true,
        variantValues: {
          select: {
            value: true,
          },
          distinct: ['value'],
        },
      },
    });

    // Obtener valores únicos por opción
    const formattedOptions = options.map((option) => ({
      id: option.id,
      name: option.name,
      slug: option.slug,
      type: option.type,
      values: [...new Set(option.variantValues.map((v) => v.value))],
    }));

    return {
      ok: true,
      options: formattedOptions,
    };
  } catch (error) {
    console.error('Error fetching variant options:', error);
    return {
      ok: false,
      message: 'Error al obtener opciones de variantes',
      options: [],
    };
  }
}
