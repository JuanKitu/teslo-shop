// actions/cart/add-to-cart.ts
'use server';

import prisma from '@/lib/prisma';
import type { ProductVariant } from '@/interfaces';
import { findVariantByColorAndSize, enrichVariant } from '@/utils';

export interface AddToCartResultCall {
  ok: boolean;
  message: string;
  variant?: ProductVariant;
}

interface Props {
  slug: string;
  quantity: number;
  color: string;
  size: string; // ✅ Cambiar de Size a string
}

/**
 * Válido stock antes de agregar al carrito y devuelve la variante con stock real
 */
export async function addToCartWithStockValidation({
  slug,
  quantity,
  color,
  size,
}: Props): Promise<AddToCartResultCall> {
  try {
    // Buscar producto con sus variantes
    const productInDb = await prisma.product.findFirst({
      where: { slug, isActive: true, deletedAt: null },
      select: {
        id: true,
        title: true,
        slug: true,
        price: true,
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

    if (!productInDb) {
      return { ok: false, message: 'Producto no encontrado' };
    }

    // Mapear variantes al formato de la app
    const variants: ProductVariant[] = productInDb.variants.map((v) => ({
      id: v.id,
      sku: v.sku,
      price: v.price,
      inStock: v.inStock,
      isActive: v.isActive,
      images: v.images.map((img) => img.url),
      optionValues: v.optionValues.map((ov) => ({
        id: ov.id,
        optionId: ov.optionId,
        optionName: ov.option.name,
        optionSlug: ov.option.slug,
        value: ov.value,
      })),
    }));

    // Buscar la variante específica
    const variant = findVariantByColorAndSize(variants, color, size);

    if (!variant) {
      return {
        ok: false,
        message: `No existe la combinación ${color} / ${size}`,
      };
    }

    // Validar stock
    if (variant.inStock <= 0) {
      return {
        ok: false,
        message: `Sin stock disponible para ${color} / ${size}`,
        variant: enrichVariant(variant),
      };
    }

    if (variant.inStock < quantity) {
      return {
        ok: false,
        message: `Solo quedan ${variant.inStock} unidades de ${color} / ${size}`,
        variant: enrichVariant(variant),
      };
    }

    // Todo OK
    return {
      ok: true,
      message: 'Producto agregado al carrito',
      variant: enrichVariant(variant),
    };
  } catch (error) {
    console.error('Error en addToCartWithStockValidation:', error);
    return {
      ok: false,
      message: 'Error al verificar disponibilidad del producto',
    };
  }
}
