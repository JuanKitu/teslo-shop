'use server';
import { auth } from '@/auth.config';
import prisma from '@/lib/prisma';
import {GetOrderResult, OrderWithDetails} from "@/interfaces";

export async function getOrderById(id: string): Promise<GetOrderResult> {
    const session = await auth();
    if (!session?.user) {
        return {order: undefined, ok: false, message: 'Debe de estar autenticado' };
    }

    try {
        const order: OrderWithDetails | null = await prisma.order.findUnique({
            where: { id },
            include: {
                OrderAddress: true,
                OrderItem: {
                    select: {
                        price: true,
                        quantity: true,
                        size: true,
                        product: {
                            select: {
                                title: true,
                                slug: true,
                                ProductImage: { select: { url: true }, take: 1 },
                            },
                        },
                    },
                },
            },
        });

        if (!order) {
            return {order: undefined, ok: false, message: 'Hubo un error en la orden' };
        }

        // Validación de rol de usuario
        if (session.user.role === 'user' && session.user.id !== order.userId) {
            return {order, ok: false, message: 'Hubo un error con el usuario' };
        }

        return {message: "", ok: true, order };
    } catch (error: unknown) {
        console.error(error);
        const message = error instanceof Error ? error.message : 'Orden no existe';
        return {order: undefined, ok: false, message };
    }
}
