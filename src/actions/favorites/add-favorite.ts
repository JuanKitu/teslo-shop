'use server';

import getServerSession, { Session } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import prisma from '@/lib/prisma';

export async function addFavorite(productId: string) {
  const session: Session | null = await getServerSession(authOptions);
  if (!session?.user?.id) throw new Error('No autenticado');

  const userId = session.user.id;

  await prisma.favorite.create({
    data: { userId, productId },
  });

  return { ok: true };
}
