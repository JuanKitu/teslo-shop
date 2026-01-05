'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

interface ReorderCategoryInput {
  categoryId: string;
  newOrder: number;
  newParentId?: string | null;
}

/**
 * Actualiza el orden de una categoría y opcionalmente su categoría padre
 * También recalcula el orden de las demás categorías afectadas
 */
export async function reorderCategories(input: ReorderCategoryInput) {
  try {
    const { categoryId, newOrder, newParentId } = input;

    // Validación: Obtener categoría actual
    const category = await prisma.category.findUnique({
      where: { id: categoryId },
      include: {
        children: { select: { id: true } },
      },
    });

    if (!category) {
      return {
        ok: false,
        message: 'Categoría no encontrada',
      };
    }

    // Validación: Prevenir anidación circular
    if (newParentId) {
      // No puede ser su propia padre
      if (newParentId === categoryId) {
        return {
          ok: false,
          message: 'Una categoría no puede ser su propia categoría padre',
        };
      }

      // No puede ser padre de uno de sus propios hijos (circular)
      const childIds = category.children.map((c) => c.id);
      if (childIds.includes(newParentId)) {
        return {
          ok: false,
          message: 'No se puede crear una jerarquía circular',
        };
      }

      // Verificar que el nuevo padre existe
      const newParent = await prisma.category.findUnique({
        where: { id: newParentId },
      });

      if (!newParent) {
        return {
          ok: false,
          message: 'La categoría padre no existe',
        };
      }
    }

    // Transacción para actualizar orden
    await prisma.$transaction(async (tx) => {
      const oldParentId = category.parentId;

      // Si cambió de padre
      if (newParentId !== oldParentId) {
        // 1. Actualizar la categoría con nuevo padre y orden
        await tx.category.update({
          where: { id: categoryId },
          data: {
            parentId: newParentId,
            order: newOrder,
          },
        });

        // 2. Reordenar hermanos en el grupo ANTERIOR
        if (oldParentId !== null) {
          const oldSiblings = await tx.category.findMany({
            where: {
              parentId: oldParentId,
              id: { not: categoryId },
            },
            orderBy: { order: 'asc' },
          });

          for (let i = 0; i < oldSiblings.length; i++) {
            await tx.category.update({
              where: { id: oldSiblings[i].id },
              data: { order: i },
            });
          }
        } else {
          // Reordenar categorías principales (sin padre)
          const mainCategories = await tx.category.findMany({
            where: {
              parentId: null,
              id: { not: categoryId },
            },
            orderBy: { order: 'asc' },
          });

          for (let i = 0; i < mainCategories.length; i++) {
            await tx.category.update({
              where: { id: mainCategories[i].id },
              data: { order: i },
            });
          }
        }

        // 3. Reordenar hermanos en el grupo NUEVO
        const newSiblings = await tx.category.findMany({
          where: {
            parentId: newParentId,
            id: { not: categoryId },
          },
          orderBy: { order: 'asc' },
        });

        // Insertar en la posición correcta
        const beforeSiblings = newSiblings.slice(0, newOrder);
        const afterSiblings = newSiblings.slice(newOrder);

        for (let i = 0; i < beforeSiblings.length; i++) {
          await tx.category.update({
            where: { id: beforeSiblings[i].id },
            data: { order: i },
          });
        }

        for (let i = 0; i < afterSiblings.length; i++) {
          await tx.category.update({
            where: { id: afterSiblings[i].id },
            data: { order: newOrder + 1 + i },
          });
        }
      } else {
        // Solo cambió de orden en el mismo grupo
        await tx.category.update({
          where: { id: categoryId },
          data: { order: newOrder },
        });

        // Reordenar hermanos
        const siblings = await tx.category.findMany({
          where: {
            parentId: oldParentId,
            id: { not: categoryId },
          },
          orderBy: { order: 'asc' },
        });

        const beforeSiblings = siblings.slice(0, newOrder);
        const afterSiblings = siblings.slice(newOrder);

        for (let i = 0; i < beforeSiblings.length; i++) {
          await tx.category.update({
            where: { id: beforeSiblings[i].id },
            data: { order: i },
          });
        }

        for (let i = 0; i < afterSiblings.length; i++) {
          await tx.category.update({
            where: { id: afterSiblings[i].id },
            data: { order: newOrder + 1 + i },
          });
        }
      }
    });

    revalidatePath('/admin/categories');

    return {
      ok: true,
      message: 'Categoría reordenada exitosamente',
    };
  } catch (error) {
    console.error('[reorderCategories]', error);
    return {
      ok: false,
      message: 'Error al reordenar categoría',
    };
  }
}
