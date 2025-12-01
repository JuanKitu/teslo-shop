'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

interface UpdateOrderItem {
  id: string;
  order: number;
}

export async function updateCategoriesOrder(items: UpdateOrderItem[]) {
  try {
    // Use transaction to update all orders atomically
    await prisma.$transaction(
      items.map((item) =>
        prisma.category.update({
          where: { id: item.id },
          data: { order: item.order },
        })
      )
    );

    revalidatePath('/admin/categories');

    return {
      ok: true,
      message: 'Orden actualizado exitosamente',
    };
  } catch (error) {
    console.error('Error updating categories order:', error);
    return {
      ok: false,
      message: 'Error al actualizar el orden',
    };
  }
}
