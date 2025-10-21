'use server';
//TODO: Revisar seguro necesita rework
import prisma from '@/lib/prisma';
import {revalidatePath} from 'next/cache';
import {Gender, Product, Size} from '@prisma/client';
import {z} from 'zod';


const productSchema = z.object({
    id: z.uuid().optional().nullable(),
    title: z.string().min(3).max(255),
    slug: z.string().min(3).max(255),
    description: z.string(),
    price: z.coerce
        .number()
        .min(0)
        .transform((val) => Number(val.toFixed(2))),
    categoryId: z.uuid(),
    tags: z.string(),
    gender: z.enum(Gender),
    variants: z
        .array(
            z.object({
                size: z.enum(Size),
                color: z.string().optional(),
                price: z.coerce.number().min(0).optional(),
                inStock: z.coerce.number().min(0),
            })
        )
        .min(1),
});

export async function createUpdateProduct(formData: FormData) {
    const data = Object.fromEntries(formData);
    const productParsed = productSchema.safeParse({
        ...data,
        variants: JSON.parse(data.variants as string || '[]'), // variantes enviadas como JSON
    });

    if (!productParsed.success) {
        console.log(productParsed.error);
        return {ok: false, errors: productParsed.error};
    }

    const productData = productParsed.data;
    productData.slug = productData.slug
        .toLowerCase()
        .replace(/ /g, '-')
        .trim();

    try {
        const result = await prisma.$transaction(async (tx) => {
            let product: Product;
            const tagsArray = productData.tags
                .split(',')
                .map((t) => t.trim().toLowerCase());

            if (productData.id) {
                // Actualizar producto
                product = await tx.product.update({
                    where: {id: productData.id},
                    data: {
                        title: productData.title,
                        slug: productData.slug,
                        description: productData.description,
                        price: productData.price,
                        categoryId: productData.categoryId,
                        gender: productData.gender,
                        tags: {set: tagsArray},
                    },
                });

                // Reemplazar variantes
                await tx.productVariant.deleteMany({
                    where: {productId: product.id},
                });
            } else {
                // Crear producto
                product = await tx.product.create({
                    data: {
                        title: productData.title,
                        slug: productData.slug,
                        description: productData.description,
                        price: productData.price,
                        categoryId: productData.categoryId,
                        gender: productData.gender,
                        tags: {set: tagsArray},
                    },
                });
            }

            // Crear variantes
            const variantsData = productData.variants.map((v) => ({
                ...v,
                productId: product.id,
                sku: `${product.id.slice(0, 6)}-${v.size}-${Math.random().toString(36).slice(2, 8)}`,
            }));

            await tx.productVariant.createMany({data: variantsData});

            // cargar images
            const newImages = formData.getAll("images") as string[];
            // Buscar las imágenes actuales (solo si es edición)
            const existingImages =
                productData.id
                    ? await tx.productImage.findMany({
                        where: {productId: productData.id},
                        select: {url: true},
                    })
                    : [];

            const existingUrls = new Set(existingImages.map((img) => img.url));
            // 1️⃣ Detectar nuevas imágenes (no están en la DB)
            const imagesToAdd = newImages.filter((url) => !existingUrls.has(url));
            // 2️⃣ Detectar imágenes eliminadas (estaban en DB pero no en el form)
            const imagesToDelete = existingImages.filter(
                (img) => !newImages.includes(img.url)
            );
            // 3️⃣ Borrar solo las que se eliminaron
            if (imagesToDelete.length > 0) {
                await tx.productImage.deleteMany({
                    where: {url: {in: imagesToDelete.map((i) => i.url)}},
                });
            }
            // 4️⃣ Crear solo las nuevas
            if (imagesToAdd.length > 0) {
                await tx.productImage.createMany({
                    data: imagesToAdd.map((url) => ({
                        url,
                        productId: product.id,
                    })),
                });
            }
            return product;
        });

        // Revalidate paths
        revalidatePath('/admin/products');
        revalidatePath(`/admin/product/${result.slug}`);
        revalidatePath(`/product/${result.slug}`);

        return {ok: true, product: result};
    } catch (error) {
        console.log(error);
        return {ok: false, message: 'No se pudo crear o actualizar el producto'};
    }
}

