'use server';

import prisma from '@/lib/prisma';
import type { SaveSearchPayload } from '@/interfaces';
import { getServerSession, Session } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function saveSearch({ term, resultsCount }: SaveSearchPayload) {
  try {
    const session: Session | null = await getServerSession(authOptions);
    const userId = session?.user?.id;

    // Guardar búsqueda global
    await prisma.searchLog.create({
      data: {
        term: term.toLowerCase().trim(),
        resultsCount,
        userId,
        timestamp: new Date(),
      },
    });

    return { ok: true };
  } catch (error) {
    console.error('Error saving search:', error);
    return { ok: false };
  }
}
