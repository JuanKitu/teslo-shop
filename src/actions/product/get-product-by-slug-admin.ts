'use server';

import prisma from '@/lib/prisma';
import { processVariants } from '@/utils';

export async function getProductBySlugForAdmin(slug: string) {
  try {
    const product = await prisma.product.findFirst({
      where: {
        slug,
        deletedAt: null,
      },
      include: {
        images: {
          where: { variantId: null },
          orderBy: { order: 'asc' },
          select: {
            id: true,
            url: true,
            alt: true,
            order: true,
            productId: true,
            variantId: true,
          },
        },

        variants: {
          where: {
            deletedAt: null,
          },
          include: {
            images: {
              orderBy: { order: 'asc' },
              select: {
                url: true,
                alt: true,
              },
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

        categories: {
          include: {
            category: {
              select: {
                id: true,
                name: true,
                slug: true,
              },
            },
          },
          orderBy: [{ isPrimary: 'desc' }, { order: 'asc' }],
        },

        brands: {
          include: {
            brand: {
              select: {
                id: true,
                name: true,
                slug: true,
              },
            },
          },
          orderBy: [{ isPrimary: 'desc' }, { order: 'asc' }],
        },
      },
    });

    if (!product) {
      return null;
    }

    const { variants, availableColors, availableSizes } = processVariants(product.variants);

    return {
      id: product.id,
      title: product.title,
      description: product.description,
      slug: product.slug,
      price: product.price,
      tags: product.tags,

      images: product.images.map((img) => img.url),
      ProductImage: product.images,

      variants,
      availableColors,
      availableSizes,

      categories: product.categories.map((pc) => ({
        categoryId: pc.categoryId,
        isPrimary: pc.isPrimary,
        order: pc.order,
        category: {
          id: pc.category.id,
          name: pc.category.name,
          slug: pc.category.slug,
        },
      })),

      brands: product.brands.map((pb) => ({
        brandId: pb.brandId,
        isPrimary: pb.isPrimary,
        order: pb.order,
        brand: {
          id: pb.brand.id,
          name: pb.brand.name,
          slug: pb.brand.slug,
        },
      })),
    };
  } catch (error) {
    console.error('[getProductBySlugForAdmin]', error);
    return null;
  }
}
