'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function deleteCategory(categoryId: string) {
  try {
    // Check if category exists
    const category = await prisma.category.findUnique({
      where: { id: categoryId },
      include: {
        _count: {
          select: {
            products: true,
            children: true,
          },
        },
      },
    });

    if (!category) {
      return {
        ok: false,
        message: 'Categoría no encontrada',
      };
    }

    // Check if category has active products
    if (category._count.products > 0) {
      return {
        ok: false,
        message: `No se puede eliminar la categoría porque tiene ${category._count.products} producto(s) asociado(s)`,
      };
    }

    // Check if category has child categories
    if (category._count.children > 0) {
      return {
        ok: false,
        message: `No se puede eliminar la categoría porque tiene ${category._count.children} subcategoría(s)`,
      };
    }

    // Soft delete
    await prisma.category.update({
      where: { id: categoryId },
      data: {
        deletedAt: new Date(),
      },
    });

    revalidatePath('/admin/categories');
    revalidatePath('/admin/products');

    return {
      ok: true,
      message: 'Categoría eliminada exitosamente',
    };
  } catch (error) {
    console.error('Error deleting category:', error);
    return {
      ok: false,
      message: 'Error al eliminar la categoría',
    };
  }
}
