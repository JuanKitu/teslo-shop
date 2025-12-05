'use server';

import prisma from '@/lib/prisma';

/**
 * Obtiene TODOS los productos para el panel de administración
 * Optimizado para búsqueda y filtrado del lado del cliente
 * Solo incluye los campos necesarios para reducir payload
 */
export async function getAllProductsForAdmin() {
  try {
    const products = await prisma.product.findMany({
      where: {
        deletedAt: null, // Solo productos activos
      },
      select: {
        id: true,
        title: true,
        slug: true,
        description: true,
        price: true,
        tags: true,
        isActive: true,
        isHidden: true,
        isFeatured: true,
        // Variants para SKU y stock
        variants: {
          select: {
            id: true,
            sku: true,
            inStock: true,
            isActive: true,
          },
          where: {
            deletedAt: null,
          },
        },
        // Imágenes (solo URLs)
        images: {
          select: {
            url: true,
          },
          where: {
            productId: { not: null },
          },
          orderBy: {
            order: 'asc',
          },
          take: 1, // Solo la primera imagen
        },
        // Categorías
        categories: {
          select: {
            categoryId: true,
            isPrimary: true,
            order: true,
            category: {
              select: {
                id: true,
                name: true,
                slug: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Transformar a formato esperado por la interfaz Product
    const formattedProducts = products.map((product) => ({
      ...product,
      images: product.images.map((img) => img.url),
      variants: product.variants.map((v) => ({
        ...v,
        price: null,
        images: [],
        optionValues: [],
        color: undefined,
        size: undefined,
      })),
      availableColors: [],
      availableSizes: [],
      ProductImage: [],
    }));

    return {
      ok: true,
      products: formattedProducts,
      total: formattedProducts.length,
    };
  } catch (error) {
    console.error('[getAllProductsForAdmin]', error);
    return {
      ok: false,
      products: [],
      total: 0,
      error: 'Error al obtener productos',
    };
  }
}
