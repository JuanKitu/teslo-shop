'use server';

import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import type { Session } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import type { Product, ProductVariant } from '@/interfaces';

export async function getUserFavorites(): Promise<Product[]> {
  const session: Session | null = await getServerSession(authOptions);
  if (!session?.user?.id) return [];

  const favorites = await prisma.favorite.findMany({
    where: { userId: session.user.id },
    include: {
      product: {
        include: {
          images: true,
          variants: {
            include: {
              images: true,
            },
          },
        },
      },
    },
  });

  // Mapeamos los productos con formato Product[]
  return favorites.map((f) => ({
    ...f.product,
    images: f.product.images.map((img) => img.url),
    variants: f.product.variants.map<ProductVariant>((v) => ({
      color: v.color,
      size: v.size,
      stock: v.inStock,
      price: v.price,
      images: v.images.map((img) => img.url),
    })),
  }));
}
