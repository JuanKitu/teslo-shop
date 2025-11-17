'use client';

import React, { useState, useEffect } from 'react';
import { useCartStore, useCheckoutStore } from '@/store';
import { currencyFormat } from '@/utils';
import { CartWarning } from '@/components/cart/CartWarning';
import { ProductsInCartLoading } from '@/app/(shop)/cart/ui/ProductsInCartLoading';
import { useCartStockValidation } from '@/hooks';
import { ProductImage } from '@/components';

export function ProductsInCheckout() {
  const [loaded, setLoaded] = useState(false);
  const cart = useCartStore((state) => state.cart);
  const refresh = useCheckoutStore((state) => state.refresh);

  // ✅ Obtener helper clearWarning del hook
  const { warnings, clearWarning } = useCartStockValidation({
    delayWindow: 1500,
    refresh,
  });

  useEffect(() => setLoaded(true), []);

  if (!loaded) return <ProductsInCartLoading />;

  // Separar errores (productos sin stock)
  const errors = warnings.filter((w) => w.type === 'error');

  return (
    <>
      {/* Errores globales (productos eliminados del carrito) */}
      {errors.map((error) => (
        <CartWarning
          key={error.variantId} // ✅ slug → variantId
          message={error.message}
          className="mb-2"
          onClose={() => clearWarning(error.variantId)} // ✅ Usar helper
        />
      ))}

      {/* Productos en el carrito */}
      {cart.map((product) => {
        // ✅ Buscar warning por variantId
        const warning = warnings.find((warn) => warn.variantId === product.variantId);

        return (
          <div
            key={product.variantId} // ✅ Usar variantId como key único
            className="flex mb-5"
          >
            <ProductImage
              src={product.image}
              alt={product.title}
              width={100}
              height={100}
              style={{ width: '100px', height: '100px' }}
              className="mr-5 rounded"
            />

            <div className="flex-1">
              <span className="font-medium">
                {product.title} - {product.quantity}{' '}
                {product.quantity === 1 ? 'unidad' : 'unidades'}
              </span>

              <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                <p>Talle: {product.size}</p>
                <p>Color: {product.color}</p>
              </div>

              <div className="mt-2">
                <p className="text-sm">Precio unitario: {currencyFormat(product.price)}</p>
                <p className="font-bold">
                  Total: {currencyFormat(product.price * product.quantity)}
                </p>
              </div>

              {/* Warning específico del producto (stock bajo) */}
              {warning && warning.type === 'warning' && (
                <CartWarning
                  message={warning.message}
                  className="mt-2"
                  onClose={() => clearWarning(warning.variantId)} // ✅ Usar helper
                />
              )}
            </div>
          </div>
        );
      })}
    </>
  );
}
