"use server";

import prisma from "@/lib/prisma";
import type { Product, ProductVariant } from "@/interfaces";

export async function getProductBySlug(slug: string): Promise<Product | null> {
    try {
        const product = await prisma.product.findUnique({
            where: { slug },
            include: {
                images: { select: { url: true } },
                variants: {
                    include: {
                        images: { select: { url: true } },
                    },
                },
                category: { select: { name: true } },
            },
        });

        if (!product) return null;

        // 🖼️ Combinar imágenes generales + de variantes (sin duplicar)
        const allImages = Array.from(
            new Set([
                ...product.images.map((img) => img.url),
                ...product.variants.flatMap((v) => v.images.map((img) => img.url)),
            ])
        );

        // 🎨 Adaptar variantes al nuevo modelo
        const formattedVariants: ProductVariant[] = product.variants.map((v) => ({
            color: v.color ?? "",
            size: v.size ?? "GENERIC",
            stock: v.inStock ?? 0,
            images: v.images.map((img) => img.url),
        }));

        return {
            id: product.id,
            title: product.title,
            description: product.description,
            price: product.price,
            slug: product.slug,
            tags: product.tags,
            gender: product.gender,
            images: allImages,
            variants: formattedVariants,
        };
    } catch (error) {
        console.error("[getProductBySlug]", error);
        throw new Error("Error al obtener producto por slug");
    }
}
