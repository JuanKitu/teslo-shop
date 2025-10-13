'use client';
import React, { useState, useEffect } from "react";
import {useCartStore, useCheckoutStore} from "@/store";
import { currencyFormat } from "@/utils";
import { CartWarning } from "@/components/cart/CartWarning";
import { ProductsInCartLoading } from "@/app/(shop)/cart/ui/ProductsInCartLoading";
import { useCartStockValidation } from "@/hooks";
import {ProductImage} from "@/components";

export function ProductsInCheckout() {
    const [loaded, setLoaded] = useState(false);
    const cart = useCartStore(state => state.cart);
    const refresh = useCheckoutStore(state => state.refresh);
    const { warnings, setWarnings } = useCartStockValidation({delayWindow: 1500, refresh});
    useEffect(() => setLoaded(true), []);

    if (!loaded) return <ProductsInCartLoading />;
    const errors = warnings.filter((w) => w.type === "error");

    return (
        <>
            {errors.map((error) => (
                <CartWarning
                    key={error.slug}
                    message={error.message}
                    className="mb-2"
                    onClose={() =>
                        setWarnings((prev) => prev.filter((w) => w.slug !== error.slug))
                    }
                />
            ))}
            {cart.map(product => {
                const warning = warnings.find(
                    (warn) =>
                        warn.slug === product.slug &&
                        (warn.size ? warn.size === product.size : true) &&
                        (warn.color ? warn.color === product.color : true)
                );
                return (
                    <div key={`${product.slug}-${product.size}`} className="flex mb-5">
                        <ProductImage
                            src={product.image}
                            alt={product.title}
                            width={100}
                            height={100}
                            style={{ width: '100px', height: '100px' }}
                            className="mr-5 rounded"
                        />
                        <div>
              <span>
                {product.title} - {product.quantity} unidades
              </span>
                            <p>Talle: {product.size}</p>
                            <p>Color: {product.color}</p>
                            <p>Precio unitario: {currencyFormat(product.price)}</p>
                            <p className="font-bold">
                                Total: {currencyFormat(product.price * product.quantity)}
                            </p>

                            {warning && (
                                <CartWarning
                                    message={warning.message}
                                    onClose={() =>
                                        setWarnings(prev =>
                                            prev.filter(
                                                w =>
                                                    !(
                                                        w.slug === warning.slug &&
                                                        w.size === warning.size &&
                                                        w.color === warning.color
                                                    )
                                            )
                                        )
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
