export interface OrderItemProduct {
  id: string;
  title: string;
  slug: string;
  image: string;
  color: string;
  size: string;
}

export interface OrderItemDetail {
  price: number;
  quantity: number;
  product: OrderItemProduct;
}

export interface OrderAddress {
  id: string;
  firstName: string;
  lastName: string;
  address: string;
  address2: string | null;
  postalCode: string;
  city: string;
  phone: string;
  countryId: string;
}

export interface OrderWithDetails {
  id: string;
  subTotal: number;
  tax: number;
  total: number;
  itemsInOrder: number;
  isPaid: boolean;
  paidAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  transactionId: string | null;
  OrderAddress: OrderAddress | null;
  OrderItem: OrderItemDetail[];
}

export interface GetOrderResult {
  ok: boolean;
  message: string;
  order?: OrderWithDetails;
}
