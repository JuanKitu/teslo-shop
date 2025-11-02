'use server';

import { Address, Size } from '@/interfaces';
import prisma from '@/lib/prisma';
import type { Order, OrderItem, ProductVariant, OrderAddress } from '@prisma/client';
import { getServerSession, Session } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export interface ProductToOrder {
  productId: string;
  quantity: number;
  size: Size;
  color: string;
}

export interface PlaceOrderSuccess {
  ok: true;
  order: Order & { OrderItem: OrderItem[] };
  updatedVariants: (ProductVariant & { product: { title: string; price: number } })[];
  orderAddress: OrderAddress;
}

export interface PlaceOrderError {
  ok: false;
  message: string;
}

export type PlaceOrderResult = PlaceOrderSuccess | PlaceOrderError;

export async function placeOrder(
  items: ProductToOrder[],
  address: Address
): Promise<PlaceOrderResult> {
  const session: Session | null = await getServerSession(authOptions);
  const userId = session?.user?.id;

  if (!userId) return { ok: false, message: 'No hay sesión de usuario' };

  // Traemos las variantes incluyendo el producto
  const variants = await prisma.productVariant.findMany({
    where: {
      OR: items.map((item) => ({
        productId: item.productId,
        size: item.size,
        color: item.color,
      })),
    },
    include: { product: true }, // ✅ necesario para acceder a variant.product
  });

  try {
    const txResult = await prisma.$transaction(async (tx) => {
      const updatedVariants: (ProductVariant & { product: { title: string; price: number } })[] =
        [];

      // 1️⃣ Validar stock y actualizarlo
      for (const item of items) {
        const variant = variants.find(
          (v) => v.productId === item.productId && v.size === item.size && v.color === item.color
        );
        if (!variant)
          throw new Error(
            `Variante no encontrada: ${item.productId} (${item.size}, ${item.color})`
          );
        if (variant.inStock < item.quantity)
          throw new Error(
            `Stock insuficiente para ${variant.product.title} (${variant.size}, ${variant.color})`
          );

        // Decrementamos stock
        const updated = await tx.productVariant.update({
          where: { id: variant.id },
          data: { inStock: { decrement: item.quantity } },
        });
        updatedVariants.push({ ...updated, product: variant.product });
      }

      // 2️⃣ Calcular totales
      const itemsInOrder = items.reduce((sum, i) => sum + i.quantity, 0);
      const subTotal = items.reduce((sum, i) => {
        const variant = updatedVariants.find(
          (v) => v.productId === i.productId && v.size === i.size && v.color === i.color
        )!;
        return sum + (variant.price ?? variant.product.price) * i.quantity;
      }, 0);
      const tax = subTotal * 0.15;
      const total = subTotal + tax;

      // 3️⃣ Crear la orden
      const order: Order & { OrderItem: OrderItem[] } = await tx.order.create({
        data: {
          userId,
          itemsInOrder,
          subTotal,
          tax,
          total,
          OrderItem: {
            createMany: {
              data: items.map((i) => {
                const variant = updatedVariants.find(
                  (v) => v.productId === i.productId && v.size === i.size && v.color === i.color
                )!;
                return {
                  productId: i.productId,
                  quantity: i.quantity,
                  size: i.size,
                  color: i.color,
                  price: variant.price ?? variant.product.price,
                };
              }),
            },
          },
        },
        include: { OrderItem: true },
      });

      // 4️⃣ Crear dirección de la orden
      const { country, ...rest } = address;
      const orderAddress = await tx.orderAddress.create({
        data: { ...rest, countryId: country, orderId: order.id },
      });

      return { updatedVariants, order, orderAddress };
    });

    return {
      ok: true,
      updatedVariants: txResult.updatedVariants,
      order: txResult.order,
      orderAddress: txResult.orderAddress,
    };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Error al procesar la orden';
    console.error('Error al colocar la orden:', message);
    return { ok: false, message };
  }
}
