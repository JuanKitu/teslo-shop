'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

interface UpdateProductRelationsInput {
  productId: string;
  upsellIds: string[];
  crossSellIds: string[];
}

export async function updateProductRelations({
  productId,
  upsellIds,
  crossSellIds,
}: UpdateProductRelationsInput) {
  try {
    await prisma.$transaction(async (tx) => {
      // Eliminar relaciones existentes
      await tx.productRelation.deleteMany({
        where: { productId },
      });

      // Crear nuevas relaciones de upsells
      if (upsellIds.length > 0) {
        await tx.productRelation.createMany({
          data: upsellIds.map((relatedProductId, index) => ({
            productId,
            relatedProductId,
            type: 'upsell',
            order: index,
          })),
        });
      }

      // Crear nuevas relaciones de cross-sells
      if (crossSellIds.length > 0) {
        await tx.productRelation.createMany({
          data: crossSellIds.map((relatedProductId, index) => ({
            productId,
            relatedProductId,
            type: 'cross-sell',
            order: index,
          })),
        });
      }
    });

    // Revalidar rutas
    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: { slug: true },
    });

    if (product) {
      revalidatePath(`/admin/product/${product.slug}`);
      revalidatePath(`/product/${product.slug}`);
    }

    return {
      ok: true,
      message: 'Productos relacionados actualizados correctamente',
    };
  } catch (error) {
    console.error('[updateProductRelations]', error);
    return {
      ok: false,
      message: 'Error al actualizar productos relacionados',
    };
  }
}
