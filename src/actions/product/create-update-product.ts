'use server';
import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

// Esquema de validación actualizado para el nuevo schema
const productSchema = z.object({
  id: z.uuid().optional(), // ✅ Opcional (solo en update)
  title: z.string().min(3).max(255),
  slug: z.string().min(3).max(255),
  description: z.string(),
  price: z.coerce
    .number()
    .min(0)
    .transform((val) => Number(val.toFixed(2))),

  categoryIds: z.array(z.uuid()).min(1, 'Debe seleccionar al menos una categoría'),

  // ✅ brandId opcional - puede ser undefined o string vacía
  brandId: z
    .uuid()
    .optional()
    .or(z.literal('')) // Acepta string vacía
    .transform((val) => (val === '' ? undefined : val)), // Convierte '' a undefined

  tags: z.string(),

  variants: z
    .array(
      z.object({
        color: z.string().min(1, 'El color es requerido'),
        size: z.string().min(1, 'La talla es requerida'),
        price: z.coerce.number().min(0).optional().nullable(),
        inStock: z.coerce.number().min(0),
        sku: z.string().optional().nullable(),
        images: z.array(z.string()).optional(),
      })
    )
    .min(1, 'Debe agregar al menos una variante'),
});

export async function createUpdateProduct(formData: FormData) {
  // --- Parsear FormData ---
  const raw = Object.fromEntries(formData);

  // Parsear variantes desde JSON
  const parsedVariants = (() => {
    try {
      return JSON.parse((raw.variants as string) || '[]');
    } catch {
      return [];
    }
  })();

  // Parsear categoryIds desde JSON o campo múltiple
  const parsedCategoryIds = (() => {
    try {
      return JSON.parse((raw.categoryIds as string) || '[]');
    } catch {
      const ids = formData.getAll('categoryIds');
      return ids.length > 0 ? ids : [];
    }
  })();

  const productParsed = productSchema.safeParse({
    ...raw,
    variants: parsedVariants,
    categoryIds: parsedCategoryIds,
  });

  if (!productParsed.success) {
    console.error('Validation errors:', productParsed.error);
    return { ok: false, errors: z.treeifyError(productParsed.error) };
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

      const tagsArray = normalizeTags(productData.tags);

      // --- Obtener IDs de opciones globales (Color y Size) ---
      const colorOption = await tx.variantOption.findUnique({
        where: { slug: 'color' },
      });

      const sizeOption = await tx.variantOption.findUnique({
        where: { slug: 'size' },
      });

      if (!colorOption || !sizeOption) {
        throw new Error('Las opciones de variante (Color/Size) no existen en la BD');
      }

      // --- Crear o actualizar producto ---
      let product;

      if (productData.id) {
        // Actualizar producto existente
        product = await tx.product.update({
          where: { id: productData.id },
          data: {
            title: productData.title,
            slug: productData.slug,
            description: productData.description,
            price: productData.price,
            tags: { set: tagsArray },
          },
        });

        // Actualizar categorías (eliminar existentes y crear nuevas)
        await tx.productCategory.deleteMany({
          where: { productId: product.id },
        });

        // Actualizar marca
        await tx.productBrand.deleteMany({
          where: { productId: product.id },
        });
      } else {
        // Crear nuevo producto
        product = await tx.product.create({
          data: {
            title: productData.title,
            slug: productData.slug,
            description: productData.description,
            price: productData.price,
            tags: { set: tagsArray },
          },
        });
      }

      // --- Asociar categorías ---
      await tx.productCategory.createMany({
        data: productData.categoryIds.map((categoryId, index) => ({
          productId: product.id,
          categoryId,
          isPrimary: index === 0,
          order: index,
        })),
      });

      // --- Asociar marca (si existe) ---
      if (productData.brandId) {
        await tx.productBrand.create({
          data: {
            productId: product.id,
            brandId: productData.brandId,
            isPrimary: true,
            order: 0,
          },
        });
      }

      // --- Obtener variantes existentes (si es actualización) ---
      const existingVariants = productData.id
        ? await tx.productVariant.findMany({
            where: { productId: productData.id },
            include: {
              images: true,
              optionValues: true,
            },
          })
        : [];

      // Helper para buscar variante existente por color+size
      const findExistingVariant = (color: string, size: string) => {
        return existingVariants.find((ev) => {
          const evColor = ev.optionValues.find((ov) => ov.optionId === colorOption.id)?.value;
          const evSize = ev.optionValues.find((ov) => ov.optionId === sizeOption.id)?.value;
          return evColor === color && evSize === size;
        });
      };

      // --- Procesar variantes ---
      for (const v of productData.variants) {
        const existing = findExistingVariant(v.color, v.size);

        if (existing) {
          // 🔄 Actualizar variante existente
          await tx.productVariant.update({
            where: { id: existing.id },
            data: {
              price: v.price,
              inStock: v.inStock,
              sku: v.sku || existing.sku,
            },
          });

          // Sincronizar imágenes si vienen definidas
          if (v.images !== undefined) {
            const incomingImages = v.images || [];
            const existingUrls = new Set(existing.images.map((i) => i.url));

            // Agregar nuevas imágenes
            const imagesToAdd = incomingImages.filter((url) => !existingUrls.has(url));
            if (imagesToAdd.length > 0) {
              await tx.productImage.createMany({
                data: imagesToAdd.map((url, index) => ({
                  url,
                  variantId: existing.id,
                  order: existing.images.length + index,
                })),
              });
            }

            // Eliminar imágenes que ya no están
            const incomingSet = new Set(incomingImages);
            const imagesToRemove = existing.images
              .filter((img) => !incomingSet.has(img.url))
              .map((img) => img.id);

            if (imagesToRemove.length > 0) {
              await tx.productImage.deleteMany({
                where: { id: { in: imagesToRemove } },
              });
            }
          }
        } else {
          // ✨ Crear nueva variante
          const generatedSku =
            v.sku ||
            `${product.slug.substring(0, 4).toUpperCase()}-${v.color.substring(0, 3).toUpperCase()}-${v.size}`;

          const newVariant = await tx.productVariant.create({
            data: {
              productId: product.id,
              price: v.price,
              inStock: v.inStock,
              sku: generatedSku,
              isActive: true,
            },
          });

          // Crear VariantOptionValues para esta variante
          await tx.variantOptionValue.createMany({
            data: [
              {
                variantId: newVariant.id,
                optionId: colorOption.id,
                value: v.color,
              },
              {
                variantId: newVariant.id,
                optionId: sizeOption.id,
                value: v.size,
              },
            ],
          });

          // Crear imágenes de la variante
          if (v.images?.length) {
            await tx.productImage.createMany({
              data: v.images.map((url, index) => ({
                url,
                variantId: newVariant.id,
                order: index,
              })),
            });
          }
        }
      }

      // --- Eliminar variantes que ya no vienen ---
      const variantsToDelete = existingVariants.filter((ev) => {
        const evColor = ev.optionValues.find((ov) => ov.optionId === colorOption.id)?.value;
        const evSize = ev.optionValues.find((ov) => ov.optionId === sizeOption.id)?.value;

        return !productData.variants.some((iv) => iv.color === evColor && iv.size === evSize);
      });

      if (variantsToDelete.length > 0) {
        const idsToDelete = variantsToDelete.map((v) => v.id);

        // Eliminar en orden correcto (respetando foreign keys)
        await tx.productImage.deleteMany({
          where: { variantId: { in: idsToDelete } },
        });

        await tx.variantOptionValue.deleteMany({
          where: { variantId: { in: idsToDelete } },
        });

        await tx.productVariant.deleteMany({
          where: { id: { in: idsToDelete } },
        });
      }

      // --- Actualizar ProductVariantOption (colores y tallas disponibles) ---
      // Eliminar opciones existentes
      await tx.productVariantOption.deleteMany({
        where: { productId: product.id },
      });

      // Obtener valores únicos
      const uniqueColors = [...new Set(productData.variants.map((v) => v.color))];
      const uniqueSizes = [...new Set(productData.variants.map((v) => v.size))];

      // Crear ProductVariantOption para Color
      await tx.productVariantOption.create({
        data: {
          productId: product.id,
          optionId: colorOption.id,
          position: 0,
          values: uniqueColors,
        },
      });

      // Crear ProductVariantOption para Size
      await tx.productVariantOption.create({
        data: {
          productId: product.id,
          optionId: sizeOption.id,
          position: 1,
          values: uniqueSizes,
        },
      });

      // --- Imágenes globales del producto ---
      const rawImages = formData.getAll('images').filter((img) => img) as string[];

      if (rawImages.length > 0) {
        const existingProductImages = productData.id
          ? await tx.productImage.findMany({
              where: { productId: product.id, variantId: null },
              select: { id: true, url: true },
            })
          : [];

        const existingUrls = new Set(existingProductImages.map((i) => i.url));

        // Agregar nuevas imágenes
        const imagesToAdd = rawImages.filter((url) => !existingUrls.has(url));
        if (imagesToAdd.length > 0) {
          await tx.productImage.createMany({
            data: imagesToAdd.map((url, index) => ({
              url,
              productId: product.id,
              order: existingProductImages.length + index,
            })),
          });
        }

        // Eliminar imágenes que ya no están
        const incomingSet = new Set(rawImages);
        const imagesToRemove = existingProductImages
          .filter((img) => !incomingSet.has(img.url))
          .map((img) => img.id);

        if (imagesToRemove.length > 0) {
          await tx.productImage.deleteMany({
            where: { id: { in: imagesToRemove } },
          });
        }
      }

      return product;
    });

    // --- Revalidaciones ---
    revalidatePath('/admin/products');
    revalidatePath(`/admin/product/${result.slug}`);
    revalidatePath(`/product/${result.slug}`);

    return { ok: true, product: result };
  } catch (error) {
    console.error('Error en createUpdateProduct:', error);
    return {
      ok: false,
      message: error instanceof Error ? error.message : 'No se pudo crear o actualizar el producto',
    };
  }
}
