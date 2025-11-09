import React from 'react';
import { OrderTable, Title } from '@/components';
import { OrdersListInterface } from '@/interfaces';
interface Props {
  orders: OrdersListInterface[];
  title: string;
}
export function OrderTemplate({ orders, title }: Props) {
  return (
    <>
      <Title title={title} />

      <div className="mb-10">
        <OrderTable orders={orders} />
      </div>
    </>
  );
}
