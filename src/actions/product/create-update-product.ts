'use server';
import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

// Esquema para optionValue dinámico
const optionValueSchema = z.object({
  optionId: z.string().uuid(),
  value: z.string().min(1, 'El valor del atributo es requerido'),
  globalValueId: z.string().uuid().optional(),
});

// Esquema de validación actualizado
const productSchema = z.object({
  id: z.uuid().optional(),
  title: z.string().min(3).max(255),
  slug: z.string().min(3).max(255),
  description: z.string(),

  // Pricing
  price: z.coerce
    .number()
    .min(0)
    .transform((val) => Number(val.toFixed(2))),
  salePrice: z.coerce.number().min(0).optional().nullable(),
  costPerItem: z.coerce.number().min(0).optional().nullable(),

  // Inventory
  trackQuantity: z.boolean().optional().default(true),

  // Shipping
  weight: z.coerce.number().min(0).optional().nullable(),
  weightUnit: z.string().optional().default('kg'),
  length: z.coerce.number().min(0).optional().nullable(),
  width: z.coerce.number().min(0).optional().nullable(),
  height: z.coerce.number().min(0).optional().nullable(),
  dimUnit: z.string().optional().default('cm'),

  // Google Shopping / Instagram
  mpn: z.string().optional(),
  ageGroup: z.string().optional(),
  gender: z.string().optional(),

  // SEO
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  metaKeywords: z.string().optional(),

  categoryIds: z.array(z.uuid()).min(1, 'Debe seleccionar al menos una categoría'),

  brandId: z
    .uuid()
    .optional()
    .or(z.literal(''))
    .transform((val) => (val === '' ? undefined : val)),

  tags: z.string(),

  variants: z
    .array(
      z.object({
        // NEW: Dynamic attributes
        optionValues: z.array(optionValueSchema).optional(),

        // Legacy fields (for backward compatibility)
        color: z.string().optional(),
        size: z.string().optional(),

        // Common fields
        price: z.coerce.number().min(0).optional().nullable(),
        salePrice: z.coerce.number().min(0).optional().nullable(), // NEW
        inStock: z.coerce.number().min(0),
        sku: z.string().optional().nullable(),
        barcode: z.string().optional().nullable(), // NEW
        images: z.array(z.string()).optional(),
      })
    )
    .min(1, 'Debe agregar al menos una variante'),
});

export async function createUpdateProduct(formData: FormData) {
  // --- Parsear FormData ---
  const raw = Object.fromEntries(formData);

  const parsedVariants = (() => {
    try {
      return JSON.parse((raw.variants as string) || '[]');
    } catch {
      return [];
    }
  })();

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
    const result = await prisma.$transaction(
      async (tx) => {
        // --- Helpers ---
        const normalizeTags = (tags: string) =>
          tags
            .split(',')
            .map((t) => t.trim().toLowerCase())
            .filter(Boolean);

        const tagsArray = normalizeTags(productData.tags);

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
              salePrice: productData.salePrice,
              costPerItem: productData.costPerItem,
              trackQuantity: productData.trackQuantity,
              weight: productData.weight,
              weightUnit: productData.weightUnit,
              length: productData.length,
              width: productData.width,
              height: productData.height,
              dimUnit: productData.dimUnit,
              mpn: productData.mpn,
              ageGroup: productData.ageGroup,
              gender: productData.gender,
              metaTitle: productData.metaTitle,
              metaDescription: productData.metaDescription,
              metaKeywords: productData.metaKeywords
                ? productData.metaKeywords
                    .split(',')
                    .map((k) => k.trim())
                    .filter(Boolean)
                : undefined,
              tags: { set: tagsArray },
            },
          });

          // Actualizar categorías
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
              salePrice: productData.salePrice,
              costPerItem: productData.costPerItem,
              trackQuantity: productData.trackQuantity,
              weight: productData.weight,
              weightUnit: productData.weightUnit,
              length: productData.length,
              width: productData.width,
              height: productData.height,
              dimUnit: productData.dimUnit,
              mpn: productData.mpn,
              ageGroup: productData.ageGroup,
              gender: productData.gender,
              metaTitle: productData.metaTitle,
              metaDescription: productData.metaDescription,
              metaKeywords: productData.metaKeywords
                ? productData.metaKeywords
                    .split(',')
                    .map((k) => k.trim())
                    .filter(Boolean)
                : undefined,
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

        // --- Obtener variantes existentes ---
        const existingVariants = productData.id
          ? await tx.productVariant.findMany({
              where: { productId: productData.id },
              include: {
                images: true,
                optionValues: true,
              },
            })
          : [];

        // --- Helper: Generar identificador único de variante ---
        const getVariantSignature = (optionValues: Array<{ optionId: string; value: string }>) => {
          return optionValues
            .sort((a, b) => a.optionId.localeCompare(b.optionId))
            .map((ov) => `${ov.optionId}:${ov.value}`)
            .join('|');
        };

        // --- Helper: Encontrar variante existente ---
        const findExistingVariant = (
          sku?: string | null,
          optionValues?: Array<{ optionId: string; value: string }>,
          legacyColor?: string,
          legacySize?: string
        ) => {
          // 1. Si tiene SKU, buscar por SKU (más confiable)
          if (sku && sku.trim() !== '') {
            const bySkuMatch = existingVariants.find((ev) => ev.sku === sku);
            if (bySkuMatch) {
              return bySkuMatch;
            }
          }

          // 2. Si tiene optionValues, buscar por signature
          if (optionValues && optionValues.length > 0) {
            const signature = getVariantSignature(optionValues);
            const bySignatureMatch = existingVariants.find((ev) => {
              const evSignature = getVariantSignature(ev.optionValues);
              return evSignature === signature;
            });
            if (bySignatureMatch) {
              return bySignatureMatch;
            }
          }

          // 3. Fallback: legacy color/size
          if (legacyColor || legacySize) {
            return existingVariants.find((ev) => {
              const colorOption = ev.optionValues.find((ov) => ov.value === legacyColor);
              const sizeOption = ev.optionValues.find((ov) => ov.value === legacySize);
              return colorOption && sizeOption;
            });
          }

          return undefined;
        };

        // --- Procesar variantes ---
        const processedVariantIds: string[] = [];

        for (let variantIdx = 0; variantIdx < productData.variants.length; variantIdx++) {
          const v = productData.variants[variantIdx];
          const existing = findExistingVariant(v.sku, v.optionValues, v.color, v.size);

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

            processedVariantIds.push(existing.id);

            // Actualizar optionValues si cambiaron
            if (v.optionValues && v.optionValues.length > 0) {
              // Eliminar valores existentes
              await tx.variantOptionValue.deleteMany({
                where: { variantId: existing.id },
              });

              // Crear nuevos valores
              await tx.variantOptionValue.createMany({
                data: v.optionValues.map((ov) => ({
                  variantId: existing.id,
                  optionId: ov.optionId,
                  value: ov.value,
                })),
              });
            }

            // Sincronizar imágenes
            if (v.images !== undefined) {
              const incomingImages = v.images || [];
              const existingUrls = new Set(existing.images.map((i: { url: string }) => i.url));

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

              const incomingSet = new Set(incomingImages);
              const imagesToRemove = existing.images
                .filter((img: { url: string; id: number }) => !incomingSet.has(img.url))
                .map((img: { id: number }) => img.id);

              if (imagesToRemove.length > 0) {
                await tx.productImage.deleteMany({
                  where: { id: { in: imagesToRemove } },
                });
              }
            }
          } else {
            // ✨ Crear nueva variante

            // Generar SKU automáticamente basado en los atributos
            let generatedSku: string;

            if (v.sku && v.sku.trim() !== '') {
              // Si el usuario especificó un SKU, usarlo
              generatedSku = v.sku;
            } else if (v.optionValues && v.optionValues.length > 0) {
              // Generar SKU basado en los valores de los atributos
              const skuParts = [product.slug.substring(0, 4).toUpperCase()];

              // Agregar valores de atributos al SKU
              v.optionValues.forEach((ov) => {
                const cleanValue = ov.value
                  .trim()
                  .toUpperCase()
                  .replace(/[^A-Z0-9]/g, '') // Remove non-alphanumeric
                  .substring(0, 4); // Max 4 chars per value

                if (cleanValue) {
                  skuParts.push(cleanValue);
                }
              });

              generatedSku = skuParts.join('-');
            } else if (v.color || v.size) {
              // Legacy: usar color y size
              const skuParts = [product.slug.substring(0, 4).toUpperCase()];
              if (v.color) skuParts.push(v.color.substring(0, 3).toUpperCase());
              if (v.size) skuParts.push(v.size.toUpperCase());
              generatedSku = skuParts.join('-');
            } else {
              // Fallback: usar UUID
              generatedSku = `${product.slug.substring(0, 4).toUpperCase()}-${crypto.randomUUID().substring(0, 8).toUpperCase()}`;
            }

            const newVariant = await tx.productVariant.create({
              data: {
                productId: product.id,
                price: v.price,
                inStock: v.inStock,
                sku: generatedSku,
                isActive: true,
              },
            });

            processedVariantIds.push(newVariant.id);

            // Crear VariantOptionValues dinámicos
            if (v.optionValues && v.optionValues.length > 0) {
              await tx.variantOptionValue.createMany({
                data: v.optionValues.map((ov) => ({
                  variantId: newVariant.id,
                  optionId: ov.optionId,
                  value: ov.value,
                })),
              });
            } else if (v.color && v.size) {
              // Legacy: crear optionValues desde color/size
              const colorOption = await tx.variantOption.findUnique({ where: { slug: 'color' } });
              const sizeOption = await tx.variantOption.findUnique({ where: { slug: 'size' } });

              if (colorOption && sizeOption) {
                await tx.variantOptionValue.createMany({
                  data: [
                    { variantId: newVariant.id, optionId: colorOption.id, value: v.color },
                    { variantId: newVariant.id, optionId: sizeOption.id, value: v.size },
                  ],
                });
              }
            }

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
        const variantsToDelete = existingVariants.filter(
          (ev) => !processedVariantIds.includes(ev.id)
        );

        if (variantsToDelete.length > 0) {
          const idsToDelete = variantsToDelete.map((v) => v.id);

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

        // --- Actualizar ProductVariantOption (valores disponibles por opción) ---
        await tx.productVariantOption.deleteMany({
          where: { productId: product.id },
        });

        // Agrupar valores únicos por optionId
        const optionValuesMap = new Map<string, Set<string>>();

        for (const v of productData.variants) {
          if (v.optionValues) {
            for (const ov of v.optionValues) {
              if (!optionValuesMap.has(ov.optionId)) {
                optionValuesMap.set(ov.optionId, new Set());
              }
              optionValuesMap.get(ov.optionId)!.add(ov.value);
            }
          }
        }

        // Crear ProductVariantOption para cada opción
        let position = 0;
        for (const [optionId, valuesSet] of optionValuesMap.entries()) {
          await tx.productVariantOption.create({
            data: {
              productId: product.id,
              optionId,
              position: position++,
              values: Array.from(valuesSet),
            },
          });
        }

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

          const incomingSet = new Set(rawImages);
          const imagesToRemove = existingProductImages
            .filter((img: { url: string; id: number }) => !incomingSet.has(img.url))
            .map((img: { id: number }) => img.id);

          if (imagesToRemove.length > 0) {
            await tx.productImage.deleteMany({
              where: { id: { in: imagesToRemove } },
            });
          }
        }

        return product;
      },
      {
        timeout: 20000, // 20 segundos para transacciones complejas
      }
    );

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
