'use server';
import { Address, Size } from "@/interfaces";
import prisma from "@/lib/prisma";
import { auth } from "@/auth.config";
import type { Order, OrderItem, Product, OrderAddress } from "@prisma/client";

export interface ProductToOrder {
    productId: string;
    quantity: number;
    size: Size;
}

export interface PlaceOrderSuccess {
    ok: true;
    order: Order & { OrderItem: OrderItem[] };
    updatedProducts: Product[];
    orderAddress: OrderAddress;
}

export interface PlaceOrderError {
    ok: false;
    message: string;
}

export type PlaceOrderResult = PlaceOrderSuccess | PlaceOrderError;

export async function placeOrder(
    productIds: ProductToOrder[],
    address: Address
): Promise<PlaceOrderResult> {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
        return { ok: false, message: "No hay sesión de usuario" };
    }

    const products = await prisma.product.findMany({
        where: { id: { in: productIds.map((p) => p.productId) } },
    });

    const itemsInOrder = productIds.reduce((count, p) => count + p.quantity, 0);

    const { subTotal, tax, total } = productIds.reduce(
        (totals, item) => {
            const product = products.find((p) => p.id === item.productId);
            if (!product) throw new Error(`${item.productId} no existe - 500`);

            const lineSubTotal = product.price * item.quantity;
            totals.subTotal += lineSubTotal;
            totals.tax += lineSubTotal * 0.15;
            totals.total += lineSubTotal * 1.15;
            return totals;
        },
        { subTotal: 0, tax: 0, total: 0 }
    );

    try {
        const prismaTx = await prisma.$transaction(async (tx) => {
            // Actualizar stock
            const updatedProducts: Product[] = await Promise.all(
                products.map((product) => {
                    const quantityToDecrement = productIds
                        .filter((p) => p.productId === product.id)
                        .reduce((acc, p) => acc + p.quantity, 0);

                    if (quantityToDecrement <= 0) {
                        throw new Error(`${product.id} no tiene cantidad definida`);
                    }

                    return tx.product.update({
                        where: { id: product.id },
                        data: { inStock: { decrement: quantityToDecrement } },
                    });
                })
            );

            updatedProducts.forEach((p) => {
                if (p.inStock < 0) {
                    throw new Error(`No hay suficiente stock del producto`);
                }
            });

            // Crear orden
            const order: Order & { OrderItem: OrderItem[] } = await tx.order.create({
                data: {
                    userId,
                    itemsInOrder,
                    subTotal,
                    tax,
                    total,
                    OrderItem: {
                        createMany: {
                            data: productIds.map((p) => ({
                                productId: p.productId,
                                quantity: p.quantity,
                                size: p.size,
                                price:
                                    products.find((prod) => prod.id === p.productId)?.price ?? 0,
                            })),
                        },
                    },
                },
                include: { OrderItem: true }, // <-- Importante para tipar correctamente
            });

            // Crear dirección
            const { country, ...restAddress } = address;
            const orderAddress: OrderAddress = await tx.orderAddress.create({
                data: { ...restAddress, countryId: country, orderId: order.id },
            });

            return { updatedProducts, order, orderAddress };
        });

        return {
            ok: true,
            updatedProducts: prismaTx.updatedProducts,
            order: prismaTx.order,
            orderAddress: prismaTx.orderAddress,
        };
    } catch (error: unknown) {
        // Si el error es una instancia de Error, usamos su mensaje real
        const message =
            error instanceof Error ? error.message : "Error al procesar la orden";
        console.error("Error al colocar la orden:", message);
        return {
            ok: false,
            message,
        };
    }
}
