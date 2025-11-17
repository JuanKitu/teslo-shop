'use server';

import prisma from '@/lib/prisma';
import type { Product } from '@/interfaces';
import { mapPrismaVariants } from '@/utils';
import { Prisma } from '@prisma/client';

interface PaginationOptions {
  page?: number;
  take?: number;
  categorySlug?: string;
  brandSlug?: string;
}

export const getPaginatedProductsWithImages = async ({
  page = 1,
  take = 12,
  categorySlug,
  brandSlug,
}: PaginationOptions): Promise<{
  currentPage: number;
  totalPages: number;
  products: Product[];
}> => {
  if (isNaN(Number(page)) || page < 1) page = 1;

  try {
    // 🔍 Construir filtros dinámicos usando tipo de Prisma
    const where: Prisma.ProductWhereInput = {
      isActive: true,
      deletedAt: null,
    };

    // Filtrar por categoría
    if (categorySlug) {
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

    // Filtrar por marca
    if (brandSlug) {
      where.brands = {
        some: {
          brand: {
            slug: brandSlug,
            isActive: true,
            deletedAt: null,
          },
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
        orderBy: { title: 'asc' },
      }),
      prisma.product.count({ where }),
    ]);

    const totalPages = Math.ceil(totalCount / take);

    // 🧠 Transformar usando las utilidades de mapeo
    const formattedProducts: Product[] = products.map((product) => {
      // Mapear variantes de Prisma usando la utilidad
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

        // Stock total (suma de todas las variantes)
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
