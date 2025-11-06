'use server';
import { getServerSession } from 'next-auth';
import type { Session } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import prisma from '@/lib/prisma';

export async function getPaginatedUsers() {
  const session: Session | null = await getServerSession(authOptions);

  if (session?.user?.role !== 'admin') {
    return {
      ok: false,
      message: 'Debe de ser un usuario administrador',
    };
  }
  const users = await prisma.user.findMany({
    orderBy: {
      name: 'desc',
    },
  });
  return {
    ok: true,
    users: users,
  };
}
