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
    userId:string
}

export interface GetOrderResult {
    ok: boolean;
    message: string;
    order: OrderWithDetails | undefined;
}
