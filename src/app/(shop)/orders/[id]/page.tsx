import React from 'react';
import { ProductImage, Title } from '@/components';
import { getOrderById, mercadopagoCheckPayment } from '@/actions';
import { redirect } from 'next/navigation';
import CardPayState from './ui/CardPayState';
import CheckoutCard from './ui/CheckoutCard';
export const dynamic = 'force-dynamic';
interface ParamsMeli {
  status?: string[];
  payment_id?: string;
}
interface Props {
  params: Promise<{
    id: string;
  }>;
  searchParams?: Promise<ParamsMeli>;
}
export default async function orderPage({ params, searchParams }: Props) {
  const { id } = await params;
  const { ok, order } = await getOrderById(id);
  if (!ok || !order) {
    redirect('/');
  }
  const { status, payment_id } = (await searchParams) ?? {};
  if (status?.includes('success') && payment_id) {
    // Verificar el pago contra la API
    await mercadopagoCheckPayment(payment_id);
  }
  const address = order.OrderAddress;
  return (
    <div className="flex justify-center items-center mb-72 px-10 sm:px-0">
      <div className="flex flex-col w-[1000px]">
        <Title title={`Orden #${id}`} />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
          {/* Carrito */}
          <div className="flex flex-col mt-5">
            <CardPayState isPaid={order.isPaid} />
            {/* Items */}
            {order.OrderItem.map((item) => (
              <div key={item.product.slug + '-' + item.product.size} className="flex mb-5">
                <ProductImage
                  src={item.product.image}
                  alt={item.product.title}
                  style={{
                    width: 100,
                    height: 100,
                  }}
                  width={100}
                  height={100}
                  className="mr-5 rounded"
                />
                <div>
                  <p>{item.product.title}</p>
                  <p>Talle: {item.product.size}</p>
                  <p>Color: {item.product.color}</p>
                  <p>
                    ${item.price} x {item.quantity}
                  </p>
                  <p className="font-bold">Subtotal ${item.price * item.quantity}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Checkout */}
          <CheckoutCard order={order} address={address} />
        </div>
      </div>
    </div>
  );
}
