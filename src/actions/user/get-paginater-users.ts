'use server';
import { auth } from '@/auth.config';
import prisma from '@/lib/prisma';

export async function getPaginatedUsers() {
  const session = await auth();

  if (session?.user.role !== 'admin') {
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
