'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

interface CreateGlobalValueInput {
  optionId: string;
  value: string;
  label?: string;
  colorHex?: string;
  imageUrl?: string;
}

export async function createGlobalValue(data: CreateGlobalValueInput) {
  try {
    const { optionId, value, label, colorHex, imageUrl } = data;

    // Check if value already exists for this option
    const existing = await prisma.globalVariantValue.findUnique({
      where: {
        optionId_value: {
          optionId,
          value,
        },
      },
    });

    if (existing) {
      return {
        ok: false,
        message: `El valor "${value}" ya existe para esta opción`,
      };
    }

    // Get max order
    const maxOrder = await prisma.globalVariantValue.findFirst({
      where: { optionId },
      orderBy: { order: 'desc' },
      select: { order: true },
    });

    const newOrder = (maxOrder?.order ?? -1) + 1;

    const globalValue = await prisma.globalVariantValue.create({
      data: {
        optionId,
        value,
        label,
        colorHex,
        imageUrl,
        order: newOrder,
      },
    });

    revalidatePath('/admin/attributes');

    return {
      ok: true,
      value: globalValue,
      message: 'Valor creado exitosamente',
    };
  } catch (error) {
    console.error('Error creating global value:', error);
    return {
      ok: false,
      message: 'Error al crear el valor',
    };
  }
}
