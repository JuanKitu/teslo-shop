'use server';
import { auth } from '@/auth.config';
import prisma from '@/lib/prisma';

export async function getOrderById( id: string ) {
    const session = await auth();
    if ( !session?.user ) {
        return {
            ok: false,
            message: 'Debe de estar autenticado'
        }
    }
    try {
        const order = await prisma.order.findUnique({
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

                                ProductImage: {
                                    select: {
                                        url: true
                                    },
                                    take: 1
                                }
                            }
                        }
                    }
                }
            }
        });
        if( !order ) return {
            ok: false,
            message: 'hubo un error en la orden'
        };
        if ( session.user.role === 'user' ) {
            if ( session.user.id !== order.userId ) return {
                ok: false,
                message: 'hubo un error con el usuario'
            }
        }
        return {
            ok: true,
            order: order,
        }
    } catch (error) {
        console.log(error);
        return {
            ok: false,
            message: 'Orden no existe'
        }
    }
}