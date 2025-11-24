'use server';

import prisma from '@/lib/prisma';
import { findVariantByColorAndSize } from '@/utils';
import { mapPrismaVariants } from '@/utils';

export interface CartItemInput {
  slug: string;
  quantity: number;
  color?: string;
  size?: string;
}

export interface ValidateCartResult {
  ok: boolean;
  adjustedItems?: {
    slug: string;
    color?: string;
    size?: string;
    newQuantity: number;
    title: string;
  }[];
  message?: string;
}

/**
 * Válida el stock de MÚLTIPLES productos del carrito contra la BD.
 * Si alguno tiene menos stock que el solicitado, devuelve los ajustes.
 */
export async function validateCartStock(cartItems: CartItemInput[]): Promise<ValidateCartResult> {
  try {
    if (cartItems.length === 0) return { ok: true };

    const slugs = cartItems.map((item) => item.slug);

    // 📦 Traemos productos y sus variantes con optionValues e images
    const productsInDb = await prisma.product.findMany({
      where: {
        slug: { in: slugs },
        isActive: true,
        deletedAt: null,
      },
      include: {
        variants: {
          where: {
            isActive: true,
            deletedAt: null,
          },
          include: {
            images: {
              select: { url: true },
              orderBy: { order: 'asc' },
            },
            optionValues: {
              include: {
                option: {
                  select: {
                    id: true,
                    name: true,
                    slug: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    const adjustedItems: ValidateCartResult['adjustedItems'] = [];

    for (const item of cartItems) {
      const product = productsInDb.find((p) => p.slug === item.slug);

      // Producto no encontrado o eliminado
      if (!product) {
        adjustedItems.push({
          slug: item.slug,
          color: item.color,
          size: item.size,
          newQuantity: 0,
          title: 'Producto no disponible',
        });
        continue;
      }

      // 🔄 Mapear variantes usando la utilidad
      const mappedVariants = mapPrismaVariants(product.variants);

      // 🎯 Buscar variante específica
      let variant;

      if (item.color && item.size) {
        // Buscar por color Y size
        variant = findVariantByColorAndSize(mappedVariants, item.color, item.size);
      } else if (item.color) {
        // Solo color
        variant = mappedVariants.find((v) => v.color?.toLowerCase() === item.color?.toLowerCase());
      } else if (item.size) {
        // Solo size
        variant = mappedVariants.find((v) => v.size?.toLowerCase() === item.size?.toLowerCase());
      } else {
        // Sin opciones específicas, tomar la primera variante con stock
        variant = mappedVariants.find((v) => v.inStock > 0) || mappedVariants[0];
      }

      const availableStock = variant?.inStock ?? 0;

      // ⚠️ Stock insuficiente
      if (availableStock < item.quantity) {
        adjustedItems.push({
          slug: item.slug,
          color: item.color,
          size: item.size,
          newQuantity: availableStock,
          title: product.title,
        });
      }
    }

    if (adjustedItems.length > 0) {
      return {
        ok: false,
        adjustedItems,
        message: 'Se ajustaron algunos productos por falta de stock',
      };
    }

    return { ok: true };
  } catch (error) {
    console.error('Error al validar stock del carrito:', error);
    return {
      ok: false,
      message: 'Error al validar el stock del carrito',
    };
  }
}
