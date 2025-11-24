'use server';

import prisma from '@/lib/prisma';
import type { Session } from 'next-auth';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import type { Product } from '@/interfaces';
import { processVariants } from '@/utils';

export async function getUserFavorites(): Promise<Product[]> {
  const session: Session | null = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return [];
  }

  try {
    const favorites = await prisma.favorite.findMany({
      where: { userId: session.user.id },
      include: {
        product: {
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
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Mapear productos

    return favorites
      .filter((fav) => fav.product && fav.product.isActive && !fav.product.deletedAt)
      .map((fav) => {
        const dbProduct = fav.product;

        // Procesar variantes usando el helper
        const { variants, availableColors, availableSizes } = processVariants(dbProduct.variants);

        return {
          id: dbProduct.id,
          title: dbProduct.title,
          description: dbProduct.description,
          slug: dbProduct.slug,
          price: dbProduct.price,
          tags: dbProduct.tags,
          images: dbProduct.images.map((img) => img.url),
          variants,
          availableColors,
          availableSizes,
        };
      });
  } catch (error) {
    console.error('Error en getUserFavorites:', error);
    return [];
  }
}
