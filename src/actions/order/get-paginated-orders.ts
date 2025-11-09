'use server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import type { Session } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function getPaginatedOrders() {
  const session: Session | null = await getServerSession(authOptions);

  if (session?.user?.role !== 'admin') {
    return {
      ok: false,
      message: 'Debe de estar autenticado',
      orders: undefined,
    };
  }
  const orders = await prisma.order.findMany({
    orderBy: {
      createdAt: 'desc',
    },
    include: {
      OrderAddress: {
        select: {
          firstName: true,
          lastName: true,
        },
      },
    },
  });
  return {
    ok: true,
    orders: orders,
    message: 'Transacciones realizadas',
  };
}
