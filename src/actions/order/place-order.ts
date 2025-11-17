'use server';

import { Address } from '@/interfaces';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import type { Session } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export interface ProductToOrder {
  productId: string;
  variantId: string; // 🆕 Ahora usamos variantId directamente
  quantity: number;
  size: string;
  color: string;
}

interface VariantWithProduct {
  id: string;
  sku: string | null;
  price: number | null;
  inStock: number;
  productId: string;
  product: {
    id: string;
    title: string;
    price: number;
  };
  optionValues: Array<{
    id: string;
    value: string;
    option: {
      slug: string;
      name: string;
    };
  }>;
}

export interface PlaceOrderSuccess {
  ok: true;
  orderId: string;
  message: string;
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

  if (!userId) {
    return { ok: false, message: 'No hay sesión de usuario' };
  }

  // Validar que haya items
  if (!items || items.length === 0) {
    return { ok: false, message: 'No hay productos en la orden' };
  }

  try {
    // 1️⃣ Obtener todas las variantes con sus datos
    const variantIds = items.map((item) => item.variantId);

    const variants = await prisma.productVariant.findMany({
      where: {
        id: { in: variantIds },
        isActive: true,
        deletedAt: null,
      },
      include: {
        product: {
          select: {
            id: true,
            title: true,
            price: true,
          },
        },
        optionValues: {
          include: {
            option: {
              select: {
                slug: true,
                name: true,
              },
            },
          },
        },
      },
    });

    // Validar que todas las variantes existan
    if (variants.length !== items.length) {
      return { ok: false, message: 'Algunas variantes no están disponibles' };
    }

    // 2️⃣ Crear la orden en una transacción
    const result = await prisma.$transaction(async (tx) => {
      const updatedVariants: VariantWithProduct[] = [];

      // Validar stock y actualizar
      for (const item of items) {
        const variant = variants.find((v) => v.id === item.variantId);

        if (!variant) {
          throw new Error(`Variante ${item.variantId} no encontrada`);
        }

        if (variant.inStock < item.quantity) {
          const colorOpt = variant.optionValues.find((ov) => ov.option.slug === 'color');
          const sizeOpt = variant.optionValues.find((ov) => ov.option.slug === 'size');

          throw new Error(
            `Stock insuficiente para ${variant.product.title} (${colorOpt?.value || 'N/A'}, ${sizeOpt?.value || 'N/A'}). Disponible: ${variant.inStock}, Solicitado: ${item.quantity}`
          );
        }

        // Actualizar stock
        const updated = await tx.productVariant.update({
          where: { id: variant.id },
          data: {
            inStock: {
              decrement: item.quantity,
            },
          },
          include: {
            product: {
              select: {
                id: true,
                title: true,
                price: true,
              },
            },
            optionValues: {
              include: {
                option: {
                  select: {
                    slug: true,
                    name: true,
                  },
                },
              },
            },
          },
        });

        updatedVariants.push(updated);
      }

      // 3️⃣ Calcular totales
      const itemsInOrder = items.reduce((sum, item) => sum + item.quantity, 0);

      const subTotal = items.reduce((sum, item) => {
        const variant = updatedVariants.find((v) => v.id === item.variantId)!;
        const price = variant.price ? variant.price : variant.product.price;
        return sum + price * item.quantity;
      }, 0);

      const tax = subTotal * 0.15;
      const total = subTotal + tax;

      // 4️⃣ Crear la orden
      const order = await tx.order.create({
        data: {
          userId,
          itemsInOrder,
          subTotal,
          tax,
          total,
          isPaid: false,
        },
      });

      // 5️⃣ Crear los items de la orden con snapshot
      for (const item of items) {
        const variant = updatedVariants.find((v) => v.id === item.variantId)!;

        // Extraer color y size de optionValues
        const colorOpt = variant.optionValues.find((ov) => ov.option.slug === 'color');
        const sizeOpt = variant.optionValues.find((ov) => ov.option.slug === 'size');

        // Crear snapshot de la variante al momento de compra
        const variantSnapshot = {
          color: colorOpt?.value || 'GENERIC',
          size: sizeOpt?.value || 'GENERIC',
          sku: variant.sku,
          productTitle: variant.product.title,
          price: variant.price ?? variant.product.price,
        };

        await tx.orderItem.create({
          data: {
            orderId: order.id,
            productId: variant.productId,
            variantId: variant.id,
            quantity: item.quantity,
            price: variant.price ?? variant.product.price,
            variantSnapshot,
          },
        });
      }

      // 6️⃣ Crear dirección de la orden
      const { country, ...addressRest } = address;

      const orderAddress = await tx.orderAddress.create({
        data: {
          firstName: addressRest.firstName,
          lastName: addressRest.lastName,
          address: addressRest.address,
          address2: addressRest.address2,
          postalCode: addressRest.postalCode,
          city: addressRest.city,
          phone: addressRest.phone,
          countryId: country,
          orderId: order.id,
        },
      });

      return { order, orderAddress };
    });

    return {
      ok: true,
      orderId: result.order.id,
      message: 'Orden creada exitosamente',
    };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Error al procesar la orden';
    console.error('Error al colocar la orden:', message);
    return { ok: false, message };
  }
}
