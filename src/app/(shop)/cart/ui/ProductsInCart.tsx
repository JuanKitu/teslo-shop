'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useCartStore } from '@/store';
import { useCartStockValidation } from '@/hooks';
import { ProductImage, QuantitySelector } from '@/components';
import { ProductsInCartLoading } from '@/app/(shop)/cart/ui/ProductsInCartLoading';
import { currencyFormat } from '@/utils';
import { IoTrashOutline, IoAlertCircleOutline } from 'react-icons/io5';

export function ProductsInCart() {
  const [loaded, setLoaded] = useState(false);
  const cart = useCartStore((state) => state.cart);
  const updateProductQuantity = useCartStore((state) => state.updateProductQuantity);
  const removeProductFromCart = useCartStore((state) => state.removeProductFromCart);

  const { warnings, clearAllWarnings } = useCartStockValidation({
    delayWindow: 1500,
  });

  useEffect(() => setLoaded(true), []);

  if (!loaded) return <ProductsInCartLoading />;

  const warningCount = warnings.filter((w) => w.type === 'warning').length;
  const errorCount = warnings.filter((w) => w.type === 'error').length;

  return (
    <div className="space-y-4">
      {/* Header con resumen de warnings */}
      {(warningCount > 0 || errorCount > 0) && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3">
              <IoAlertCircleOutline className="w-5 h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
              <div>
                {warningCount > 0 && (
                  <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                    {warningCount} {warningCount === 1 ? 'producto tiene' : 'productos tienen'}{' '}
                    stock limitado
                  </p>
                )}
                {errorCount > 0 && (
                  <p className="text-sm font-medium text-red-700 dark:text-red-300 mt-1">
                    {errorCount} {errorCount === 1 ? 'producto no está' : 'productos no están'}{' '}
                    disponible
                    {errorCount === 1 ? '' : 's'}
                  </p>
                )}
                <p className="text-xs text-yellow-700 dark:text-yellow-300 mt-1">
                  Las cantidades se han ajustado automáticamente
                </p>
              </div>
            </div>
            <button
              onClick={clearAllWarnings}
              className="text-xs text-yellow-700 dark:text-yellow-300 hover:underline flex-shrink-0"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}

      {/* Lista de productos */}
      <div className="space-y-3">
        {cart.map((product) => {
          const warning = warnings.find((warn) => warn.variantId === product.variantId);
          const hasWarning = warning && warning.type === 'warning';
          const hasError = warning && warning.type === 'error';

          return (
            <div
              key={product.variantId}
              className={`flex gap-4 p-4 rounded-lg border transition-colors ${
                hasError
                  ? 'border-red-200 dark:border-red-800 bg-red-50/50 dark:bg-red-900/10'
                  : hasWarning
                    ? 'border-yellow-200 dark:border-yellow-800 bg-yellow-50/50 dark:bg-yellow-900/10'
                    : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800'
              }`}
            >
              {/* Imagen */}
              <Link href={`/product/${product.slug}`} className="flex-shrink-0">
                <ProductImage
                  src={product.image}
                  alt={product.title}
                  width={100}
                  height={100}
                  className="rounded-md object-cover hover:opacity-80 transition-opacity"
                />
              </Link>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <Link
                  href={`/product/${product.slug}`}
                  className="font-semibold text-base hover:underline block truncate"
                >
                  {product.title}
                </Link>

                <div className="flex items-center gap-3 mt-1 text-sm text-gray-600 dark:text-gray-400">
                  <span>
                    Talle: <span className="font-medium">{product.size}</span>
                  </span>
                  <span>•</span>
                  <span>
                    Color: <span className="font-medium">{product.color}</span>
                  </span>
                </div>

                <p className="text-base font-bold mt-2">{currencyFormat(product.price)}</p>

                {/* Selector de cantidad */}
                <div className="mt-3">
                  <QuantitySelector
                    quantity={product.quantity}
                    maxStock={product.inStock}
                    onQuantityChanged={(newQty) => updateProductQuantity(product, newQty)}
                  />
                </div>

                {/* Subtotal */}
                <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                  Subtotal:{' '}
                  <span className="font-semibold">
                    {currencyFormat(product.price * product.quantity)}
                  </span>
                </div>

                {/* Warning inline */}
                {warning && (
                  <div
                    className={`mt-3 flex items-start gap-2 text-sm ${
                      warning.type === 'error'
                        ? 'text-red-700 dark:text-red-300'
                        : 'text-yellow-700 dark:text-yellow-300'
                    }`}
                  >
                    <IoAlertCircleOutline className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    <span>{warning.message}</span>
                  </div>
                )}

                {/* Botón remover */}
                <button
                  onClick={() => removeProductFromCart(product)}
                  className="mt-3 flex items-center gap-1 text-sm text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors"
                >
                  <IoTrashOutline className="w-4 h-4" />
                  Remover
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty state */}
      {cart.length === 0 && (
        <div className="text-center py-16">
          <div className="text-gray-400 dark:text-gray-500 mb-4">
            <svg
              className="mx-auto w-20 h-20"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
          </div>
          <p className="text-gray-600 dark:text-gray-400 text-lg mb-2">Tu carrito está vacío</p>
          <p className="text-sm text-gray-500 dark:text-gray-500 mb-6">
            Agrega productos para comenzar tu compra
          </p>
          <Link
            href="/"
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Explorar productos
          </Link>
        </div>
      )}
    </div>
  );
}
