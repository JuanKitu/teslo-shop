'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useCartStore } from '@/store';
import { useCartStockValidation } from '@/hooks';
import { ProductImage, QuantitySelector, CartWarning } from '@/components';
import { ProductsInCartLoading } from '@/app/(shop)/cart/ui/ProductsInCartLoading';

export function ProductsInCart() {
    const [loaded, setLoaded] = useState(false);
    const cart = useCartStore(state => state.cart);
    const updateProductQuantity = useCartStore(state => state.updateProductQuantity);
    const removeProductFromCart = useCartStore(state => state.removeProductFromCart);
    const { warnings, setWarnings } = useCartStockValidation({ delayWindow: 1500 });

    useEffect(() => setLoaded(true), []);

    if (!loaded) return <ProductsInCartLoading />;

    return (
        <>
            {cart.map(product => {
                const warning = warnings.find(
                    (warn) =>
                        warn.slug === product.slug &&
                        (warn.size ? warn.size === product.size : true) &&
                        (warn.color ? warn.color === product.color : true)
                );
                return (
                    <div key={`${product.slug}-${product.size}`} className="flex mb-5 relative">
                        <ProductImage
                            src={product.image}
                            alt={product.title}
                            width={100}
                            height={100}
                            style={{ width: '100px', height: '100px' }}
                            className="mr-5 rounded"
                        />

                        <div className="flex-1">
                            <Link
                                href={`/product/${product.slug}`}
                                className="hover:underline cursor-pointer font-semibold"
                            >
                                {product.title}
                            </Link>
                            <p className="text-sm">Talle: {product.size}</p>
                            <p className="text-sm">Color: {product.color}</p>
                            <p className="text-sm">${product.price}</p>

                            <QuantitySelector
                                quantity={product.quantity}
                                maxStock={product.inStock}
                                onQuantityChanged={(newQty) => updateProductQuantity(product, newQty)}
                            />

                            <button
                                onClick={() => removeProductFromCart(product)}
                                className="underline mt-3 cursor-pointer text-sm"
                            >
                                Remover
                            </button>

                            {warning && (
                                <CartWarning
                                    message={warning.message}
                                    onClose={() =>
                                        setWarnings(prev => prev.filter(w => w.slug !== warning.slug))
                                    }
                                />
                            )}
                        </div>
                    </div>
                );
            })}
        </>
    );
}
