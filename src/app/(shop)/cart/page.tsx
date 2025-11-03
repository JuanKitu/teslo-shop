import React from 'react';
import { Title } from '@/components';
import Link from 'next/link';
import { ProductsInCart } from '@/app/(shop)/cart/ui/ProductsInCart';
import { OrderSummary } from '@/app/(shop)/cart/ui/OrderSummary';

export default function CartPage() {
  //redirect("/empty")
  return (
    <div className="flex justify-center items-center mb-72 px-10 sm:px-0">
      <div className="flex flex-col w-[1000px]">
        <Title title="Carrito" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
          {/* Carrito */}
          <div className="flex flex-col mt-5">
            <span className="text-xl">Agregar más items</span>
            <Link href="/" className="underline mb-5">
              Seguir comprando
            </Link>
            {/* Items */}
            <ProductsInCart />
          </div>

          {/* Checkout */}
          <div className="bg-white rounded-xl shadow-xl p-7 h-fit">
            <OrderSummary />
          </div>
        </div>
      </div>
    </div>
  );
}
