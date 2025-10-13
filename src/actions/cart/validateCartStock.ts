'use server';

import prisma from '@/lib/prisma';
import type { Size } from '@/interfaces';

export interface CartItemInput {
    slug: string;
    quantity: number;
    color?: string;
    size?: Size;
}

export interface ValidateCartResult {
    ok: boolean;
    adjustedItems?: {
        slug: string;
        color?: string;
        size?: Size;
        newQuantity: number;
        title: string;
    }[];
    message?: string;
}

/**
 * Valida el stock de todos los productos del carrito contra la BD.
 * Si alguno tiene menos stock que el solicitado, devuelve los ajustes.
 */
export async function validateCartStock(
    cartItems: CartItemInput[]
): Promise<ValidateCartResult> {
    try {
        if (cartItems.length === 0) return { ok: true };

        const slugs = cartItems.map((item) => item.slug);

        // Traemos productos y sus variantes
        const productsInDb = await prisma.product.findMany({
            where: { slug: { in: slugs } },
            include: { variants: true },
        });

        const adjustedItems: ValidateCartResult['adjustedItems'] = [];
        for (const item of cartItems) {
            const product = productsInDb.find((p) => p.slug === item.slug);
            if (!product) continue; // producto eliminado de la BD

            // Buscar variante exacta: coincide color y talla si están definidos
            const variant = product.variants.find((v) => {
                const colorMatch = item.color ? v.color === item.color : true;
                const sizeMatch = item.size ? v.size === item.size : true;
                return colorMatch && sizeMatch;
            });

            const availableStock = variant?.inStock ?? 0;

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
