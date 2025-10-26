'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useCartStore } from '@/store';
import { OrderSummaryLoading } from '@/app/(shop)/cart/ui/OrderSummaryLoading';
import { useShallow } from 'zustand/react/shallow';
import { currencyFormat } from '@/utils';

export function OrderSummary() {
  const [loaded, setLoaded] = useState(false);
  const { itemsInCart, subtotal, tax, total } = useCartStore(
    useShallow((state) => state.getSummaryInformation())
  );
  useEffect(() => {
    setLoaded(true);
  }, []);
  if (!loaded) {
    return <OrderSummaryLoading />;
  }
  return (
    <>
      <h2 className="text-2xl mb-2">Resumen de orden</h2>
      <div className="grid grid-cols-2">
        <span>Nro. Productos</span>
        <span className="text-right">
          {itemsInCart === 1 ? '1 artículo' : `${itemsInCart} artículos`}
        </span>

        <span>Subtotal</span>
        <span className="text-right">{currencyFormat(subtotal)}</span>

        <span>Impuestos (%15)</span>
        <span className="text-right">{currencyFormat(tax)}</span>

        <span className="mt-5 text-2xl">Total:</span>
        <span className="mt-5 text-2xl text-right">{currencyFormat(total)}</span>
      </div>
      <div className="mt-5 mb-2 w-full">
        <Link className="flex btn-primary justify-center" href="/checkout/address">
          Checkout
        </Link>
      </div>
    </>
  );
}
