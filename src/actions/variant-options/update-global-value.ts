'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

interface UpdateGlobalValueInput {
  id: string;
  value?: string;
  label?: string;
  colorHex?: string;
  imageUrl?: string;
}

export async function updateGlobalValue(data: UpdateGlobalValueInput) {
  try {
    const { id, value, label, colorHex, imageUrl } = data;

    const updateData: Record<string, unknown> = {};
    if (value !== undefined) updateData.value = value;
    if (label !== undefined) updateData.label = label;
    if (colorHex !== undefined) updateData.colorHex = colorHex;
    if (imageUrl !== undefined) updateData.imageUrl = imageUrl;

    const globalValue = await prisma.globalVariantValue.update({
      where: { id },
      data: updateData,
    });

    revalidatePath('/admin/attributes');

    return {
      ok: true,
      value: globalValue,
      message: 'Valor actualizado exitosamente',
    };
  } catch (error) {
    console.error('Error updating global value:', error);
    return {
      ok: false,
      message: 'Error al actualizar el valor',
    };
  }
}
