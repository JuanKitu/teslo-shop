'use server';
import { auth } from '@/auth.config';
import prisma from '@/lib/prisma';

export async function getPaginatedOrders() {
  const session = await auth();

  if (session?.user.role !== 'admin') {
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
