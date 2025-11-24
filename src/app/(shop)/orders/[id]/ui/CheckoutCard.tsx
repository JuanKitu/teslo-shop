'use client';

import React, { useEffect, useState } from 'react';
import { OrderAddress, OrderWithDetails } from '@/interfaces';
import { currencyFormat } from '@/utils';
import CardPayState from './CardPayState';
import PaymentMethods from './PaymentMethods';
import clsx from 'clsx';
import { useTheme } from 'next-themes';

interface Props {
  address: OrderAddress | null;
  order: OrderWithDetails;
}

export default function CheckoutCard({ address, order }: Props) {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  const isDark = theme === 'dark';

  if (!mounted) return null;

  return (
    <div
      className={clsx(
        'rounded-xl shadow-xl p-7 border',
        isDark
          ? 'bg-[var(--color-card)] text-[var(--color-text)] border-[var(--color-border)]'
          : 'bg-white text-gray-900 border-gray-200'
      )}
    >
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
      <div
        className={clsx(
          'w-full h-0.5 rounded mb-10',
          isDark ? 'bg-[var(--color-border)]' : 'bg-gray-300'
        )}
      ></div>

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
  );
}
