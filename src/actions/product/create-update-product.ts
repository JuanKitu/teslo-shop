'use server';
//TODO: Revisar seguro necesita rework
import prisma from '@/lib/prisma';
import {revalidatePath} from 'next/cache';
import {Gender, Product, Size} from '@prisma/client';
import {z} from 'zod';
import {v2 as cloudinary} from 'cloudinary';

cloudinary.config(process.env.CLOUDINARY_URL ?? '');

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
        return { ok: false, errors: productParsed.error};
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
                    where: { id: productData.id },
                    data: {
                        title: productData.title,
                        slug: productData.slug,
                        description: productData.description,
                        price: productData.price,
                        categoryId: productData.categoryId,
                        gender: productData.gender,
                        tags: { set: tagsArray },
                    },
                });

                // Reemplazar variantes
                await tx.productVariant.deleteMany({
                    where: { productId: product.id },
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
                        tags: { set: tagsArray },
                    },
                });
            }

            // Crear variantes
            const variantsData = productData.variants.map((v) => ({
                ...v,
                productId: product.id,
                sku: `${product.id.slice(0, 6)}-${v.size}-${Math.random().toString(36).slice(2, 8)}`,
            }));

            await tx.productVariant.createMany({ data: variantsData });

            // Subir imágenes generales
            const files = formData.getAll('images') as File[];
            if (files.length > 0) {
                const images = await uploadImages(files);
                await tx.productImage.createMany({
                    data: images.map((url) => ({
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

        return { ok: true, product: result };
    } catch (error) {
        console.log(error);
        return { ok: false, message: 'No se pudo crear o actualizar el producto' };
    }
}

async function uploadImages(images: File[]) {
    try {
        return await Promise.all(
            images.map(async (file) => {
                const buffer = await file.arrayBuffer();
                const base64 = Buffer.from(buffer).toString('base64');
                const res = await cloudinary.uploader.upload(`data:image/png;base64,${base64}`);
                return res.secure_url;
            })
        );
    } catch (error) {
        console.log(error);
        return [];
    }
}
