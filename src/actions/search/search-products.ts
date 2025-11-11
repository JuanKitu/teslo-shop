'use server';

import prisma from '@/lib/prisma';
import { findBestMatch, fuzzyFilter } from '@/utils/search/fuzzy-search';
import type { SearchResult } from '@/interfaces';
import type { Prisma } from '@prisma/client';

type ProductWithRelations = Prisma.ProductGetPayload<{
  include: {
    images: true;
    variants: true;
    category: true;
    Favorite: true;
    OrderItem: {
      select: {
        quantity: true;
      };
    };
  };
}>;

export async function searchProducts(
  query: string,
  limit: number = 10,
  useFuzzy: boolean = true
): Promise<{
  ok: boolean;
  results: SearchResult[];
  total: number;
  suggestion?: string;
}> {
  try {
    if (!query || query.trim().length < 2) {
      return { ok: true, results: [], total: 0 };
    }

    const searchTerm = query.trim().toLowerCase();

    // 1. Búsqueda exacta primero
    const exactMatches = await prisma.product.findMany({
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
        images: { take: 1 },
        variants: true,
        category: true,
        Favorite: true,
        OrderItem: { select: { quantity: true } },
      },
    });

    // Sí hay resultados exactos suficientes, retornarlos
    if (exactMatches.length >= limit / 2) {
      return {
        ok: true,
        results: mapProductsToResults(exactMatches),
        total: exactMatches.length,
      };
    }

    // 2. Si no hay suficientes resultados, aplicar fuzzy search
    if (useFuzzy) {
      const allProducts = await prisma.product.findMany({
        take: 1000,
        include: {
          images: { take: 1 },
          variants: true,
          category: true,
          Favorite: true,
          OrderItem: { select: { quantity: true } },
        },
      });

      // Aplicar fuzzy search
      const fuzzyResults = fuzzyFilter(
        allProducts,
        searchTerm,
        (product) => {
          return [product.title, product.description, ...product.tags, product.category.name]
            .join(' ')
            .toLowerCase();
        },
        50
      );

      // Combinar resultados
      const exactIds = new Set(exactMatches.map((p) => p.id));
      const combinedResults = [
        ...exactMatches,
        ...fuzzyResults.filter((p) => !exactIds.has(p.id)).slice(0, limit - exactMatches.length),
      ];

      // Buscar sugerencia
      let suggestion: string | undefined;

      if (combinedResults.length < 3) {
        const allTitles = allProducts.map((p) => p.title);
        const allWords = Array.from(
          new Set(
            allTitles.flatMap((title) =>
              title
                .toLowerCase()
                .split(/\s+/)
                .filter((w) => w.length > 3)
            )
          )
        );

        const bestMatch = findBestMatch(searchTerm, allWords, 60);

        if (bestMatch && bestMatch.score >= 60) {
          const suggestedProduct = allProducts.find((p) =>
            p.title.toLowerCase().includes(bestMatch.match)
          );

          if (suggestedProduct) {
            suggestion = suggestedProduct.title;
          }
        }
      }

      return {
        ok: true,
        results: mapProductsToResults(combinedResults).slice(0, limit),
        total: combinedResults.length,
        suggestion,
      };
    }

    return {
      ok: true,
      results: mapProductsToResults(exactMatches),
      total: exactMatches.length,
    };
  } catch (error) {
    console.error('Error searching products:', error);
    return { ok: false, results: [], total: 0 };
  }
}

function mapProductsToResults(products: ProductWithRelations[]): SearchResult[] {
  return products.map((product) => {
    const totalStock = product.variants.reduce((sum: number, variant) => sum + variant.inStock, 0);

    const totalSold = product.OrderItem.reduce((sum: number, item) => sum + item.quantity, 0);

    let badge: SearchResult['badge'] = undefined;

    if (totalSold > 50) {
      badge = 'bestseller';
    } else if (product.Favorite.length > 10) {
      badge = 'trending';
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
}
