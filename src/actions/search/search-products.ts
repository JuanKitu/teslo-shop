'use server';

import prisma from '@/lib/prisma';
import { SearchResult } from '@/interfaces';

export async function searchProducts(
  query: string,
  limit: number = 10
): Promise<{ ok: boolean; results: SearchResult[]; total: number }> {
  try {
    if (!query || query.trim().length < 2) {
      return { ok: true, results: [], total: 0 };
    }

    const searchTerm = query.trim().toLowerCase();

    // Búsqueda en productos
    const products = await prisma.product.findMany({
      where: {
        OR: [
          { title: { contains: searchTerm, mode: 'insensitive' } },
          { description: { contains: searchTerm, mode: 'insensitive' } },
          { tags: { has: searchTerm } },
          { slug: { contains: searchTerm, mode: 'insensitive' } },
        ],
      },
      take: limit,
      include: {
        images: {
          take: 1,
        },
        variants: true,
        category: true,
      },
    });

    // Mapear resultados
    const results: SearchResult[] = products.map((product) => {
      // Calcular stock total de todas las variantes
      const totalStock = product.variants.reduce(
        (sum: number, variant) => sum + variant.inStock,
        0
      );

      // Determinar badge
      let badge: SearchResult['badge'] = undefined;

      // Como no tienes createdAt, puedes agregar otra lógica
      // Por ejemplo, productos con mucho stock o basado en ventas
      if (totalStock > 100) {
        badge = 'bestseller';
      }

      return {
        id: product.id,
        title: product.title,
        slug: product.slug,
        price: product.price,
        image: product.images[0]?.url || '/imgs/placeholder.jpg',
        badge,
        stock: totalStock,
        category: product.category.name,
      };
    });

    return {
      ok: true,
      results,
      total: results.length,
    };
  } catch (error) {
    console.error('Error searching products:', error);
    return { ok: false, results: [], total: 0 };
  }
}
