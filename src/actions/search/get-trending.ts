'use server';

import prisma from '@/lib/prisma';
import type { TrendingSearch } from '@/interfaces';

export async function getTrendingSearches(
  limit: number = 10
): Promise<{ ok: boolean; trending: TrendingSearch[] }> {
  try {
    // Últimos 7 días
    const lastWeek = new Date();
    lastWeek.setDate(lastWeek.getDate() - 7);

    // Búsquedas más populares
    const searches = await prisma.searchLog.groupBy({
      by: ['term'],
      where: {
        timestamp: {
          gte: lastWeek,
        },
        resultsCount: {
          gt: 0, // Solo búsquedas con resultados
        },
      },
      _count: {
        term: true,
      },
      orderBy: {
        _count: {
          term: 'desc',
        },
      },
      take: limit,
    });

    // Calcular tendencia (comparar con semana anterior)
    const trending: TrendingSearch[] = await Promise.all(
      searches.map(async (search) => {
        const twoWeeksAgo = new Date(lastWeek);
        twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 7);

        const previousCount = await prisma.searchLog.count({
          where: {
            term: search.term,
            timestamp: {
              gte: twoWeeksAgo,
              lt: lastWeek,
            },
          },
        });

        let trend: 'up' | 'down' | 'stable' = 'stable';
        if (search._count.term > previousCount) trend = 'up';
        else if (search._count.term < previousCount) trend = 'down';

        return {
          term: search.term,
          count: search._count.term,
          trend,
        };
      })
    );

    return { ok: true, trending };
  } catch (error) {
    console.error('Error getting trending searches:', error);
    return { ok: false, trending: [] };
  }
}
