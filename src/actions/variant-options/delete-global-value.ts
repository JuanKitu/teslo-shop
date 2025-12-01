'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function deleteGlobalValue(valueId: string) {
  try {
    // Soft delete by setting isActive to false
    await prisma.globalVariantValue.update({
      where: { id: valueId },
      data: { isActive: false },
    });

    revalidatePath('/admin/attributes');

    return {
      ok: true,
      message: 'Valor eliminado exitosamente',
    };
  } catch (error) {
    console.error('Error deleting global value:', error);
    return {
      ok: false,
      message: 'Error al eliminar el valor',
    };
  }
}
