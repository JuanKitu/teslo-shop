"use server";

import prisma from "@/lib/prisma";

export async function getStockBySlug(slug: string): Promise<number> {
    try {
        // Buscar el producto con sus variantes
        const product = await prisma.product.findUnique({
            where: { slug },
            include: {
                variants: {
                    select: { inStock: true },
                },
            },
        });

        // Si no existe, devolvemos 0
        if (!product) return 0;

        // Sumar el stock total de las variantes
        return product.variants.reduce(
            (sum, variant) => sum + (variant.inStock || 0),
            0
        );
    } catch (error) {
        console.error("[getStockBySlug]", error);
        return 0;
    }
}
