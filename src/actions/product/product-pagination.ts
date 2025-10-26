'use server';

import prisma from '@/lib/prisma';
import { Gender } from '@prisma/client';
import type { Product } from '@/interfaces';

interface PaginationOptions {
  page?: number;
  take?: number;
  gender?: Gender;
}

export const getPaginatedProductsWithImages = async ({
  page = 1,
  take = 12,
  gender,
}: PaginationOptions): Promise<{
  currentPage: number;
  totalPages: number;
  products: Product[];
}> => {
  if (isNaN(Number(page)) || page < 1) page = 1;

  try {
    const [products, totalCount] = await Promise.all([
      prisma.product.findMany({
        take,
        skip: (page - 1) * take,
        where: { gender },
        include: {
          images: { select: { url: true } },
          variants: {
            include: {
              images: { select: { url: true } },
            },
          },
        },
        orderBy: { title: 'asc' },
      }),
      prisma.product.count({ where: { gender } }),
    ]);

    const totalPages = Math.ceil(totalCount / take);

    // 🧠 Transformar productos al formato frontend actualizado
    const formattedProducts: Product[] = products.map((product) => {
      const allImages = [
        ...product.images.map((img) => img.url),
        ...product.variants.flatMap((v) => v.images.map((img) => img.url)),
      ];

      return {
        id: product.id,
        title: product.title,
        description: product.description,
        price: product.price,
        slug: product.slug,
        tags: product.tags,
        gender: product.gender,
        images: Array.from(new Set(allImages)), // 🔹 Evita duplicados
        variants: product.variants.map((v) => ({
          color: v.color ?? '',
          size: v.size ?? 'GENERIC',
          stock: v.inStock ?? 0, // ✅ nuevo campo directo
          images: v.images.map((img) => img.url),
        })),
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
