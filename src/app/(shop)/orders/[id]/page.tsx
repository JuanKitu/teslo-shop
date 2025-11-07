import React from 'react';
import { ProductImage, Title } from '@/components';
import { getOrderById, mercadopagoCheckPayment } from '@/actions';
import { redirect } from 'next/navigation';
import { currencyFormat } from '@/utils';
import CardPayState from './ui/CardPayState';
import PaymentMethods from './ui/PaymentMethods';
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
          <div className="bg-white rounded-xl shadow-xl p-7">
            <h2 className="text-2xl mb-2 font-bold">Dirección de entrega</h2>
            <div className="mb-10">
              <p className="text-xl">{`${address!.firstName} ${address!.lastName}`}</p>
              <p>{address!.address}</p>
              <p>{address!.address2}</p>
              <p>Código postal: {address!.postalCode}</p>
              <p>{`${address!.city} ${address!.countryId}`}</p>
              <p>{address!.phone}</p>
            </div>
            {/* Divider */}
            <div className="w-full h-0.5 rounded bg-gray-300 mb-10"></div>

            <h2 className="text-2xl mb-2">Resumen de orden</h2>
            <div className="grid grid-cols-2">
              <span>Nro. Productos</span>
              <span className="text-right">
                {order?.itemsInOrder === 1 ? '1 artículo' : `${order?.itemsInOrder} artículos`}
              </span>

              <span>Subtotal</span>
              <span className="text-right">{currencyFormat(order!.subTotal)}</span>

              <span>Impuestos (%15)</span>
              <span className="text-right">{currencyFormat(order!.tax)}</span>

              <span className="mt-5 text-2xl">Total:</span>
              <span className="mt-5 text-2xl text-right">{currencyFormat(order!.total)}</span>
            </div>
            <div className="mt-5 mb-2 w-full">
              {order.isPaid ? (
                <CardPayState isPaid={order.isPaid} />
              ) : (
                <PaymentMethods amount={order!.total} orderId={order!.id} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
