'use server';

import prisma from "@/lib/prisma";
import type { ProductVariant, Size } from "@/interfaces";

export interface AddToCartResult {
    ok: boolean;
    message: string;
    variant?: ProductVariant; // Variante con stock real
}

interface Props {
    slug: string;
    quantity: number;
    color: string;
    size: Size;
}

/**
 * Válido stock antes de agregar al carrito y devuelve la variante con stock real
 */
export async function addToCartWithStockValidation({
                                                       slug,
                                                       quantity,
                                                       color,
                                                       size,
                                                   }: Props): Promise<AddToCartResult> {
    try {
        const productInDb = await prisma.product.findFirst({
            where: { slug },
            include: { variants: { include: { images: true } } },
        });

        if (!productInDb) {
            return { ok: false, message: "Producto no encontrado" };
        }

        const variantDb = productInDb.variants.find(v => v.color === color && v.size === size);

        if (!variantDb) {
            return { ok: false, message: "Variante no encontrada para ese color/talla" };
        }

        // Mapear al formato de tu app
        const variant: ProductVariant = {
            color: variantDb.color ?? "",
            size: variantDb.size as Size,
            stock: variantDb.inStock,
            images: variantDb.images.map(img => img.url),
        };

        if (variant.stock <= 0) {
            return { ok: false, message: "Sin stock disponible", variant };
        }

        if (variant.stock < quantity) {
            return {
                ok: false,
                message: `Solo quedan ${variant.stock} unidades en color ${color} talla ${size}`,
                variant,
            };
        }

        return { ok: true, message: "Producto agregado al carrito", variant };
    } catch (error) {
        console.error(error);
        return { ok: false, message: "Error al verificar disponibilidad del producto" };
    }
}
