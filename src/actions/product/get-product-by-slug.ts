'use server';

import prisma from '@/lib/prisma';
import type { Product } from '@/interfaces';
import { processVariants } from '@/utils';

export async function getProductBySlug(slug: string): Promise<Product | null> {
  try {
    const product = await prisma.product.findFirst({
      where: {
        slug,
        isActive: true,
        deletedAt: null,
      },
      include: {
        images: {
          where: { variantId: null },
          orderBy: { order: 'asc' },
        },
        variants: {
          where: {
            isActive: true,
            deletedAt: null,
          },
          include: {
            images: {
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
    });

    if (!product) {
      return null;
    }

    // Procesar variantes usando el helper
    const { variants, availableColors, availableSizes } = processVariants(product.variants);

    // Mapear producto completo

    return {
      id: product.id,
      title: product.title,
      description: product.description,
      slug: product.slug,
      price: product.price,
      tags: product.tags,
      images: product.images.map((img) => img.url),
      variants,
      availableColors,
      availableSizes,
    };
  } catch (error) {
    console.error('[getProductBySlug]', error);
    return null;
  }
}
