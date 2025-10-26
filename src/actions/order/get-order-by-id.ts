'use server';

import { auth } from '@/auth.config';
import prisma from '@/lib/prisma';
import { GetOrderResult, OrderWithDetails } from '@/interfaces';

export async function getOrderById(id: string): Promise<GetOrderResult> {
  const session = await auth();
  if (!session?.user) {
    return { ok: false, message: 'Debe de estar autenticado' };
  }
  try {
    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        OrderAddress: true,
        OrderItem: {
          include: {
            product: {
              include: {
                images: true,
                variants: {
                  include: { images: true },
                },
              },
            },
          },
        },
      },
    });

    if (!order) {
      return { ok: false, message: 'La orden no existe' };
    }

    if (session.user.role === 'user' && session.user.id !== order.userId) {
      return { ok: false, message: 'No tiene acceso a esta orden' };
    }

    const orderWithDetails: OrderWithDetails = {
      ...order,
      OrderItem: order.OrderItem.map((item) => {
        // Buscar variante (si la orden tiene color/size)
        const variant = item.product.variants.find(
          (v) => v.size === item.size && (v.color === item.color || !v.color)
        );

        const image =
          variant?.images?.[0]?.url || item.product.images?.[0]?.url || '/imgs/placeholder.jpg';

        return {
          price: item.price,
          quantity: item.quantity,
          product: {
            id: item.product.id,
            title: item.product.title,
            slug: item.product.slug,
            image,
            color: item.color || variant?.color,
            size: item.size || variant?.size,
          },
        };
      }),
    };

    return { ok: true, message: '', order: orderWithDetails };
  } catch (error) {
    console.error(error);
    return {
      ok: false,
      message: error instanceof Error ? error.message : 'Error al obtener la orden',
    };
  }
}
