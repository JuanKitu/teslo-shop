"use server";
//TODO: Revisar seguro necesita rework
import prisma from "@/lib/prisma";
import { v2 as cloudinary } from "cloudinary";
import { revalidatePath } from "next/cache";

cloudinary.config(process.env.CLOUDINARY_URL ?? "");

export async function deleteProductImage(imageId: number, imageUrl: string) {
    // Evita borrar imágenes locales del filesystem
    if (!imageUrl.startsWith("http")) {
        return {
            ok: false,
            error: "No se pueden borrar imágenes locales (FS)",
        };
    }

    // Extrae el nombre de la imagen para Cloudinary
    const imageName = imageUrl.split("/").pop()?.split(".")[0] ?? "";

    try {
        // 1️⃣ Eliminar de Cloudinary
        await cloudinary.uploader.destroy(imageName);

        // 2️⃣ Eliminar de la base
        const deletedImage = await prisma.productImage.delete({
            where: { id: imageId },
            select: {
                product: {
                    select: { slug: true },
                },
                variant: {
                    select: {
                        product: {
                            select: { slug: true },
                        },
                    },
                },
            },
        });

        // 3️⃣ Determinar a qué pertenece (producto o variante)
        const productSlug =
            deletedImage.product?.slug || deletedImage.variant?.product.slug;

        // 4️⃣ Revalidar paths relevantes
        if (productSlug) {
            revalidatePath(`/admin/products`);
            revalidatePath(`/admin/product/${productSlug}`);
            revalidatePath(`/product/${productSlug}`);
        }

        return { ok: true };
    } catch (error) {
        console.error("[deleteProductImage]", error);
        return {
            ok: false,
            message: "No se pudo eliminar la imagen",
        };
    }
}
