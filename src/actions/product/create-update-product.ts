'use server';
import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { Gender, Product, Size } from '@prisma/client';
import { z } from 'zod';

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
        images: z.array(z.string()).optional(),
      })
    )
    .min(1),
});

export async function createUpdateProduct(formData: FormData) {
  const data = Object.fromEntries(formData);
  const productParsed = productSchema.safeParse({
    ...data,
    variants: JSON.parse((data.variants as string) || '[]'),
  });

  if (!productParsed.success) {
    console.log(productParsed.error);
    return { ok: false, errors: productParsed.error };
  }

  const productData = productParsed.data;
  productData.slug = productData.slug.toLowerCase().replace(/ /g, '-').trim();

  try {
    const result = await prisma.$transaction(async (tx) => {
      let product: Product;
      const tagsArray = productData.tags.split(',').map((t) => t.trim().toLowerCase());

      // --- Crear o actualizar producto ---
      if (productData.id) {
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
      } else {
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

      // --- Variantes ---
      const existingVariants = await tx.productVariant.findMany({
        where: { productId: product.id },
        include: { images: true },
      });

      const incomingVariants = productData.variants;

      // 1️⃣ Crear o actualizar variantes
      for (const variant of incomingVariants) {
        const existing = existingVariants.find(
          (ev) => ev.size === variant.size && ev.color === variant.color
        );

        if (existing) {
          // Actualizar variante existente
          await tx.productVariant.update({
            where: { id: existing.id },
            data: {
              price: variant.price ?? productData.price,
              inStock: variant.inStock,
            },
          });

          // 🔹 Nuevas imágenes
          if (variant.images?.length) {
            const existingUrls = new Set(existing.images.map((i) => i.url));
            const newImages = variant.images.filter((url) => !existingUrls.has(url));

            if (newImages.length > 0) {
              await tx.productImage.createMany({
                data: newImages.map((url) => ({
                  url,
                  variantId: existing.id,
                })),
              });
            }
          }

          // 🔹 No borramos imágenes acá — eso se hace manualmente desde el front
        } else {
          // Crear nueva variante
          const created = await tx.productVariant.create({
            data: {
              size: variant.size,
              color: variant.color,
              price: variant.price ?? productData.price,
              inStock: variant.inStock,
              productId: product.id,
              sku: `${product.id.slice(0, 6)}-${variant.size}-${Math.random()
                .toString(36)
                .slice(2, 8)}`,
            },
          });

          if (variant.images?.length) {
            await tx.productImage.createMany({
              data: variant.images.map((url) => ({
                url,
                variantId: created.id,
              })),
            });
          }
        }
      }

      // 2️⃣ Eliminar variantes que ya no están
      const variantsToDelete = existingVariants.filter(
        (ev) => !incomingVariants.some((v) => v.size === ev.size && v.color === ev.color)
      );

      if (variantsToDelete.length > 0) {
        await tx.productImage.deleteMany({
          where: { variantId: { in: variantsToDelete.map((v) => v.id) } },
        });
        await tx.productVariant.deleteMany({
          where: { id: { in: variantsToDelete.map((v) => v.id) } },
        });
      }

      // --- Imágenes del producto (globales) ---
      const newImages = formData.getAll('images') as string[];

      const existingImages = productData.id
        ? await tx.productImage.findMany({
            where: { productId: product.id, variantId: null },
            select: { url: true },
          })
        : [];

      const existingUrls = new Set(existingImages.map((img) => img.url));
      const imagesToAdd = newImages.filter((url) => !existingUrls.has(url));
      const imagesToDelete = existingImages.filter((img) => !newImages.includes(img.url));

      if (imagesToDelete.length > 0) {
        await tx.productImage.deleteMany({
          where: { url: { in: imagesToDelete.map((i) => i.url) } },
        });
      }

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

    return { ok: true, product: result };
  } catch (error) {
    console.log(error);
    return { ok: false, message: 'No se pudo crear o actualizar el producto' };
  }
}
