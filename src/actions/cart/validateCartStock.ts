'use server';

import prisma from '@/lib/prisma';

export interface CartItemInput {
    slug: string;
    quantity: number;
    size?: string; // opcional, por si manejás talles
}

export interface ValidateCartResult {
    ok: boolean;
    adjustedItems?: {
        slug: string;
        newQuantity: number;
        title: string;
    }[];
    message?: string;
}

/**
 * Válida el stock de todos los productos del carrito contra la BD.
 * Si alguno tiene menos stock que el solicitado, devuelve los ajustes.
 */
export async function validateCartStock(
    cartItems: CartItemInput[]
): Promise<ValidateCartResult> {
    try {
        if (cartItems.length === 0) {
            return { ok: true };
        }

        const slugs = cartItems.map(i => i.slug);

        // Traemos los productos actuales desde la BD
        const productsInDb = await prisma.product.findMany({
            where: { slug: { in: slugs } },
            select: { slug: true, inStock: true, title: true },
        });

        const adjustedItems: ValidateCartResult['adjustedItems'] = [];

        for (const item of cartItems) {
            const product = productsInDb.find(p => p.slug === item.slug);
            if (!product) continue; // producto eliminado

            if (product.inStock < item.quantity) {
                adjustedItems.push({
                    slug: item.slug,
                    newQuantity: product.inStock,
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
