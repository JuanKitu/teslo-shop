import type { Order, OrderAddress } from "@prisma/client";

export interface OrderProduct {
    title: string;
    slug: string;
    ProductImage: { url: string }[];
}

export interface OrderItemWithProduct {
    price: number;
    quantity: number;
    size: string;
    product: OrderProduct;
}

export interface OrderWithDetails extends Order {
    OrderAddress: OrderAddress | null; // reflejando la posibilidad de null
    OrderItem: OrderItemWithProduct[];
}

export interface GetOrderSuccess {
    ok: true;
    order: OrderWithDetails;
}

export interface GetOrderError {
    ok: false;
    message: string;
}

export type GetOrderResult = GetOrderSuccess | GetOrderError;