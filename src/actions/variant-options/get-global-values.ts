'use server';

import prisma from '@/lib/prisma';

export async function getGlobalValues(optionId: string) {
  try {
    return await prisma.globalVariantValue.findMany({
      where: {
        optionId,
        isActive: true,
      },
      orderBy: {
        order: 'asc',
      },
    });
  } catch (error) {
    console.error('Error fetching global values:', error);
    throw new Error('No se pudieron obtener los valores');
  }
}
