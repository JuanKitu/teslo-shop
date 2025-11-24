'use server';

import prisma from '@/lib/prisma';
import type { Product } from '@/interfaces';
import { mapPrismaVariants } from '@/utils';
import { Prisma } from '@prisma/client';

interface PaginationOptions {
  page?: number;
  take?: number;
  categorySlug?: string;
  subcategorySlug?: string; // ← NUEVO
  brandSlug?: string;
  color?: string;
  size?: string;
  brand?: string;
  maxPrice?: number;
}

export const getPaginatedProductsWithImages = async ({
  page = 1,
  take = 12,
  categorySlug,
  subcategorySlug, // ← NUEVO
  brandSlug,
  color,
  size,
  brand,
  maxPrice,
}: PaginationOptions): Promise<{
  currentPage: number;
  totalPages: number;
  products: Product[];
}> => {
  if (isNaN(Number(page)) || page < 1) page = 1;

  try {
    // 🔍 Construir filtros dinámicos
    const where: Prisma.ProductWhereInput = {
      isActive: true,
      deletedAt: null,
    };

    // 📁 Filtrar por categoría O subcategoría
    if (subcategorySlug) {
      // Si hay subcategoría, priorizar sobre categoría
      where.categories = {
        some: {
          category: {
            slug: subcategorySlug,
            isActive: true,
            deletedAt: null,
          },
        },
      };
    } else if (categorySlug) {
      // Si solo hay categoría, filtrar por ella
      where.categories = {
        some: {
          category: {
            slug: categorySlug,
            isActive: true,
            deletedAt: null,
          },
        },
      };
    }

    // 🏷️ Filtrar por marca (brandSlug de ruta o brand de filtro)
    if (brand || brandSlug) {
      where.brands = {
        some: {
          brand: {
            slug: brand || brandSlug,
            isActive: true,
            deletedAt: null,
          },
        },
      };
    }

    // 💰 Filtrar por precio máximo
    if (maxPrice) {
      where.price = {
        lte: maxPrice,
      };
    }

    // 🎨 Filtros por variantes (color y/o size)
    if (color || size) {
      const variantFilters: Prisma.ProductVariantWhereInput[] = [];

      if (color) {
        variantFilters.push({
          optionValues: {
            some: {
              option: { slug: 'color' },
              value: color,
            },
          },
        });
      }

      if (size) {
        variantFilters.push({
          optionValues: {
            some: {
              option: { slug: 'size' },
              value: size,
            },
          },
        });
      }

      where.variants = {
        some: {
          isActive: true,
          deletedAt: null,
          AND: variantFilters,
        },
      };
    }

    // 📊 Query optimizada con include completo
    const [products, totalCount] = await Promise.all([
      prisma.product.findMany({
        take,
        skip: (page - 1) * take,
        where,
        include: {
          images: {
            select: { url: true, alt: true },
            orderBy: { order: 'asc' },
          },
          variants: {
            where: {
              isActive: true,
              deletedAt: null,
            },
            include: {
              images: {
                select: { url: true, alt: true },
                orderBy: { order: 'asc' },
              },
              optionValues: {
                include: {
                  option: {
                    select: {
                      id: true,
                      name: true,
                      slug: true,
                    },
                  },
                },
              },
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.product.count({ where }),
    ]);

    const totalPages = Math.ceil(totalCount / take);

    // 🧠 Transformar usando las utilidades de mapeo
    const formattedProducts: Product[] = products.map((product) => {
      // Mapear variantes de Prisma
      const mappedVariants = mapPrismaVariants(product.variants);

      // Recolectar todas las imágenes únicas
      const productImages = product.images.map((img) => img.url);
      const variantImages = product.variants.flatMap((v) => v.images.map((img) => img.url));
      const allImages = Array.from(new Set([...productImages, ...variantImages]));

      // Extraer colores y tallas disponibles
      const availableColors = [
        ...new Set(mappedVariants.filter((v) => v.color && v.inStock > 0).map((v) => v.color!)),
      ];

      const availableSizes = [
        ...new Set(mappedVariants.filter((v) => v.size && v.inStock > 0).map((v) => v.size!)),
      ];

      return {
        id: product.id,
        title: product.title,
        description: product.description,
        price: product.price,
        slug: product.slug,
        tags: product.tags,
        images: allImages.length > 0 ? allImages : ['/placeholder.png'],

        // Stock total
        inStock: mappedVariants.reduce((acc, v) => acc + v.inStock, 0),

        // Variantes mapeadas
        variants: mappedVariants,

        // Colores y tallas disponibles
        availableColors,
        availableSizes,
      };
    });

    return {
      currentPage: page,
      totalPages,
      products: formattedProducts,
    };
  } catch (error) {
    console.error('[getPaginatedProductsWithImages]', error);
    throw new Error('No se pudo cargar los productos');
  }
};
