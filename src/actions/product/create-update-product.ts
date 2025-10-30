'use server';
import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { Gender, Size } from '@prisma/client';
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
        images: z.array(z.string()).optional(), // si viene definido sincronizamos; si no viene, no tocamos
      })
    )
    .min(1),
});

export async function createUpdateProduct(formData: FormData) {
  // --- Parsear FormData a objetos simples ---
  const raw = Object.fromEntries(formData);
  const parsedVariants = (() => {
    try {
      return JSON.parse((raw.variants as string) || '[]');
    } catch (err) {
      void err;
      return null;
    }
  })();

  const productParsed = productSchema.safeParse({
    ...raw,
    variants: parsedVariants ?? [],
  });

  if (!productParsed.success) {
    console.log(productParsed.error);
    return { ok: false, errors: productParsed.error };
  }

  const productData = productParsed.data;

  // Normalizar slug
  productData.slug = productData.slug.toLowerCase().replace(/\s+/g, '-').trim();

  try {
    const result = await prisma.$transaction(async (tx) => {
      // --- Helpers ---
      const normalizeTags = (tags: string) =>
        tags
          .split(',')
          .map((t) => t.trim().toLowerCase())
          .filter(Boolean);

      // Devuelve variantes existentes con sus imágenes (si hay productoId)
      const existingVariants = productData.id
        ? await tx.productVariant.findMany({
            where: { productId: productData.id },
            include: { images: true },
          })
        : [];

      // Crear o actualizar producto
      const tagsArray = normalizeTags(productData.tags);
      let product = null;

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

      // --- Variantes: sincronizar incoming vs existing ---
      const incomingVariants = productData.variants;

      // Para facilitar búsquedas por size+color
      const findExistingVariant = (v: (typeof incomingVariants)[number]) =>
        existingVariants.find((ev) => ev.size === v.size && ev.color === v.color);

      // 1) Crear o actualizar variantes e imágenes asociadas (sincronización)
      for (const v of incomingVariants) {
        const existing = findExistingVariant(v);

        if (existing) {
          // Actualizar campos básicos
          await tx.productVariant.update({
            where: { id: existing.id },
            data: {
              price: v.price ?? productData.price,
              inStock: v.inStock,
            },
          });

          // Si el cliente envío la propiedad images (incluso como []), sincronizamos
          if (Object.prototype.hasOwnProperty.call(v, 'images')) {
            const incomingImages = Array.isArray(v.images) ? v.images : [];
            const existingUrls = new Set(existing.images.map((i) => i.url));

            // 1.a) Agregar nuevas imágenes
            const imagesToAdd = incomingImages.filter((url) => !existingUrls.has(url));
            if (imagesToAdd.length > 0) {
              await tx.productImage.createMany({
                data: imagesToAdd.map((url) => ({
                  url,
                  variantId: existing.id,
                })),
              });
            }

            // 1.b) Eliminar imágenes que ya no están en incomingImages
            const incomingSet = new Set(incomingImages);
            const imagesToRemove = existing.images
              .map((i) => i.url)
              .filter((url) => !incomingSet.has(url));

            if (imagesToRemove.length > 0) {
              await tx.productImage.deleteMany({
                where: {
                  variantId: existing.id,
                  url: { in: imagesToRemove },
                },
              });
            }
          }
          // Si la propiedad images no viene en el payload del variant, respetamos las imágenes existentes.
        } else {
          // Crear nueva variante
          const created = await tx.productVariant.create({
            data: {
              size: v.size,
              color: v.color,
              price: v.price ?? productData.price,
              inStock: v.inStock,
              productId: product.id,
              sku: `${product.id.slice(0, 6)}-${v.size}-${Math.random().toString(36).slice(2, 8)}`,
            },
          });

          // Si el cliente envía images para la nueva variante, crearlas
          if (v.images?.length) {
            await tx.productImage.createMany({
              data: v.images.map((url) => ({
                url,
                variantId: created.id,
              })),
            });
          }
        }
      }

      // 2) Eliminar variantes que ya no vienen en incomingVariants (y sus imágenes)
      const variantsToDelete = existingVariants.filter(
        (ev) => !incomingVariants.some((iv) => iv.size === ev.size && iv.color === ev.color)
      );

      if (variantsToDelete.length > 0) {
        const idsToDelete = variantsToDelete.map((v) => v.id);

        // Borrar imágenes de esas variantes
        await tx.productImage.deleteMany({
          where: { variantId: { in: idsToDelete } },
        });

        // Borrar variantes
        await tx.productVariant.deleteMany({
          where: { id: { in: idsToDelete } },
        });
      }

      // --- Imágenes globales del producto (productId populated, variantId = null) ---
      // Se asume que el front envía todas las imágenes globales en campos 'images' con la misma key multiple
      // Ej: formData.append('images', url)
      const rawImages = formData.getAll('images') || []; // puede ser [] o ['url1', 'url2']
      const newImages = Array.isArray(rawImages) ? (rawImages as string[]) : [String(rawImages)];

      const existingProductImages = productData.id
        ? await tx.productImage.findMany({
            where: { productId: product.id, variantId: null },
            select: { url: true },
          })
        : [];

      const existingProductUrls = new Set(existingProductImages.map((i) => i.url));
      const addProductImages = newImages.filter((url) => !existingProductUrls.has(url));
      const removeProductImages = existingProductImages
        .map((i) => i.url)
        .filter((url) => !newImages.includes(url));

      if (removeProductImages.length > 0) {
        await tx.productImage.deleteMany({
          where: { productId: product.id, variantId: null, url: { in: removeProductImages } },
        });
      }

      if (addProductImages.length > 0) {
        await tx.productImage.createMany({
          data: addProductImages.map((url) => ({ url, productId: product.id })),
        });
      }

      return product;
    });

    // --- Revalidaciones ---
    revalidatePath('/admin/products');
    revalidatePath(`/admin/product/${result.slug}`);
    revalidatePath(`/product/${result.slug}`);

    return { ok: true, product: result };
  } catch (error) {
    console.error(error);
    return { ok: false, message: 'No se pudo crear o actualizar el producto' };
  }
}
