'use server';

import prisma from '@/lib/prisma';
import { findVariantByColorAndSize } from '@/utils';
import { mapPrismaVariants } from '@/utils';
import type { ProductVariant } from '@/interfaces';

export interface AddToCartInput {
  slug: string;
  color?: string;
  size?: string;
  quantity: number;
}

export interface AddToCartSuccess {
  ok: true;
  variant: ProductVariant;
  message: string;
}

export interface AddToCartError {
  ok: false;
  variant?: ProductVariant;
  message: string;
}

export type AddToCartResult = AddToCartSuccess | AddToCartError;

/**
 * Valida el stock de UN SOLO producto antes de agregarlo al carrito
 */
export async function addToCartWithStockValidation(
  input: AddToCartInput
): Promise<AddToCartResult> {
  try {
    const { slug, color, size, quantity } = input;

    // Validaciones básicas
    if (!color || !size) {
      return { ok: false, message: 'Debes seleccionar color y talla' };
    }

    if (quantity <= 0) {
      return { ok: false, message: 'La cantidad debe ser mayor a 0' };
    }

    // Buscar producto
    const product = await prisma.product.findUnique({
      where: {
        slug,
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

    if (!product) {
      return { ok: false, message: 'Producto no encontrado' };
    }

    // Mapear variantes
    const mappedVariants = mapPrismaVariants(product.variants);

    // Buscar variante específica
    const variant = findVariantByColorAndSize(mappedVariants, color, size);

    if (!variant) {
      return {
        ok: false,
        message: `La variante (${color}, ${size}) no está disponible`,
      };
    }

    // Validar stock
    if (variant.inStock === 0) {
      return {
        ok: false,
        variant,
        message: 'Producto sin stock',
      };
    }

    if (variant.inStock < quantity) {
      return {
        ok: false,
        variant,
        message: `Solo hay ${variant.inStock} unidades disponibles`,
      };
    }

    // Todo OK
    return {
      ok: true,
      variant,
      message: 'Producto agregado al carrito',
    };
  } catch (error) {
    console.error('[addToCartWithStockValidation]', error);
    return {
      ok: false,
      message: 'Error al validar el stock',
    };
  }
}
