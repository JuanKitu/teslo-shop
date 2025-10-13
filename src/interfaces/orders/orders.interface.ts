import type { Order, OrderAddress } from "@prisma/client";

export interface OrderProduct {
    id: string;
    title: string;
    slug: string;
    image: string;           // imagen principal o de la variante
    color?: string;
    size?: string;
}

export interface OrderItemWithProduct {
    price: number;
    quantity: number;
    product: OrderProduct;
}

export interface OrderWithDetails extends Order {
    OrderAddress: OrderAddress | null;
    OrderItem: OrderItemWithProduct[];
}

export interface GetOrderResult {
    ok: boolean;
    message: string;
    order?: OrderWithDetails;
}
