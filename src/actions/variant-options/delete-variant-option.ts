'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function deleteVariantOption(optionId: string) {
  try {
    // Check if option exists
    const option = await prisma.variantOption.findUnique({
      where: { id: optionId },
      include: {
        _count: {
          select: {
            productOptions: true,
            variantValues: true,
            globalValues: true,
          },
        },
      },
    });

    if (!option) {
      return {
        ok: false,
        message: 'Opción no encontrada',
      };
    }

    // Check if option is used in products
    if (option._count.productOptions > 0) {
      return {
        ok: false,
        message: `No se puede eliminar porque ${option._count.productOptions} producto(s) usan esta opción`,
      };
    }

    // Delete option (will cascade delete variant values)
    await prisma.variantOption.delete({
      where: { id: optionId },
    });

    revalidatePath('/admin/attributes');

    return {
      ok: true,
      message: 'Opción eliminada exitosamente',
    };
  } catch (error) {
    console.error('Error deleting variant option:', error);
    return {
      ok: false,
      message: 'Error al eliminar la opción',
    };
  }
}
