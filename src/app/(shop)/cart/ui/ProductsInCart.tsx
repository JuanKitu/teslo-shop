'use client';
import React, { useState, useEffect } from "react";
import { useCartStockValidation } from "@/hooks";
import {useCartStore} from "@/store";
import { ProductImage, QuantitySelector, CartWarning } from "@/components";
import {ProductsInCartLoading} from "@/app/(shop)/cart/ui/ProductsInCartLoading";
import Link from "next/link";

export function ProductsInCart() {
    const [loaded, setLoaded] = useState(false);
    const { warnings, setWarnings } = useCartStockValidation({delayWindow: 1500});
    const cart = useCartStore(state => state.cart);
    const updateProductQuantity = useCartStore(state => state.updateProductQuantity);
    const removeProductFromCart = useCartStore(state => state.removeProductFromCart);

    useEffect(() => setLoaded(true), []);

    if (!loaded) return <ProductsInCartLoading/>;

    return (
        <>
            {cart.map(product => {
                const warning = warnings.find(w => w.slug === product.slug);
                return (
                    <div key={`${product.slug}-${product.size}`} className="flex mb-5 relative">
                        <ProductImage
                            src={product.image}
                            alt={product.title}
                            width={100}
                            height={100}
                            style={{width: '100px', height: '100px'}}
                            className="mr-5 rounded"
                        />
                        <div>
                            <Link className="hover:underline cursor-pointer" href={`/product/${product.slug}`}>
                                {product.title}
                            </Link>
                            <p>Talle: {product.size}</p>
                            <p>${product.price}</p>

                            <QuantitySelector
                                totalStock={product.inStock}
                                onQuantityChanged={(value) => updateProductQuantity(product, value)}
                                quantity={product.quantity}/>
                            <button
                                onClick={() => removeProductFromCart(product)}
                                className="underline mt-3 cursor-pointer">
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
