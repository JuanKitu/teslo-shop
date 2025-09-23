'use server';
import prisma from '@/lib/prisma';

export interface AddToCartResult {
    ok: boolean;
    message: string;
}

export async function addToCartWithStockValidation(
    slug: string,
    quantity: number,
): Promise<AddToCartResult> {
    try {
        // Verificar stock disponible
        const productInDb = await prisma.product.findFirst({
            where: { 
                slug
            },
            select: { 
                inStock: true,
                title: true 
            }
        });

        if (!productInDb) {
            return {
                ok: false,
                message: "Producto no encontrado"
            };
        }

        // Verificar si hay stock suficiente
        if (productInDb.inStock < quantity) {
            return {
                ok: false,
                message: `No hay stock disponible. Solo quedan ${productInDb.inStock} unidades`
            };
        }

        // Si hay stock, devolver éxito (el carrito se manejará en el cliente)
        return {
            ok: true,
            message: "Producto agregado al carrito"
        };

    } catch (error) {
        console.error('Error al validar stock:', error);
        return {
            ok: false,
            message: "Error al verificar disponibilidad del producto"
        };
    }
}
