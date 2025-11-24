'use server';

import prisma from '@/lib/prisma';
import { GetOrderResult, OrderWithDetails } from '@/interfaces';
import { getServerSession } from 'next-auth';
import type { Session } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function getOrderById(id: string): Promise<GetOrderResult> {
  const session: Session | null = await getServerSession(authOptions);

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
                images: {
                  where: { variantId: null },
                  orderBy: { order: 'asc' },
                },
              },
            },
            variant: {
              include: {
                images: {
                  orderBy: { order: 'asc' },
                },
                optionValues: {
                  include: {
                    option: {
                      select: {
                        slug: true,
                      },
                    },
                  },
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
        // Extraer datos del snapshot (datos guardados al momento de la compra)
        const snapshot = item.variantSnapshot as {
          color?: string;
          size?: string;
          sku?: string;
          [key: string]: unknown;
        } | null;

        // Intentar obtener color y size del snapshot primero
        let color = snapshot?.color;
        let size = snapshot?.size;

        // Si la variante aún existe, extraer datos actuales de optionValues
        if (item.variant) {
          const colorOption = item.variant.optionValues.find((ov) => ov.option.slug === 'color');
          const sizeOption = item.variant.optionValues.find((ov) => ov.option.slug === 'size');

          // Usar valores actuales si no hay snapshot
          if (!color) color = colorOption?.value;
          if (!size) size = sizeOption?.value;
        }

        // Seleccionar imagen: primero de la variante, luego del producto
        const image =
          item.variant?.images?.[0]?.url ||
          item.product.images?.[0]?.url ||
          '/imgs/placeholder.jpg';

        return {
          price: item.price,
          quantity: item.quantity,
          product: {
            id: item.product.id,
            title: item.product.title,
            slug: item.product.slug,
            image,
            color: color || 'N/A',
            size: size || 'N/A',
          },
        };
      }),
    };

    return { ok: true, message: '', order: orderWithDetails };
  } catch (error) {
    console.error('Error en getOrderById:', error);
    return {
      ok: false,
      message: error instanceof Error ? error.message : 'Error al obtener la orden',
    };
  }
}
