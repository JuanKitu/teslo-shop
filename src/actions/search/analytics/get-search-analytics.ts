'use server';

import prisma from '@/lib/prisma';
import type { SearchAnalytics } from '@/interfaces';

export async function getSearchAnalytics(
  startDate?: Date,
  endDate?: Date
): Promise<{ ok: boolean; analytics: SearchAnalytics[] }> {
  try {
    const searches = await prisma.searchLog.groupBy({
      by: ['term'],
      where: {
        timestamp: {
          gte: startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
          lte: endDate || new Date(),
        },
      },
      _count: {
        term: true,
      },
      _sum: {
        resultsCount: true,
      },
      _max: {
        timestamp: true,
      },
    });

    const analytics: SearchAnalytics[] = searches.map((search) => ({
      term: search.term,
      searchCount: search._count.term,
      resultsFound: search._sum.resultsCount || 0,
      clickThrough: 0, // Aquí puedes agregar lógica de clicks
      lastSearched: search._max.timestamp || new Date(),
    }));

    // Ordenar por búsquedas más frecuentes
    analytics.sort((a, b) => b.searchCount - a.searchCount);

    return { ok: true, analytics };
  } catch (error) {
    console.error('Error getting search analytics:', error);
    return { ok: false, analytics: [] };
  }
}
