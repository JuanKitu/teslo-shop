'use client';
import React, {useEffect, useState} from 'react'
import {useCartStore} from "@/store";
import {ProductImage, QuantitySelector} from "@/components";
import {ProductsInCartLoading} from "@/app/(shop)/cart/ui/ProductsInCartLoading";
import Link from "next/link";

export function ProductsInCart() {
    const [loaded, setLoaded] = useState(false)
    const productsInCart = useCartStore(state => state.cart);
    const updateProductQuantity = useCartStore(state => state.updateProductQuantity);
    const removeProductFromCart = useCartStore(state => state.removeProductFromCart);
    useEffect(()=>{
        setLoaded(true);
    }, [])
    if (!loaded) {
        return (
            <ProductsInCartLoading />
        )
    }
    return (
        <>
            {
                productsInCart.map(product => (
                    <div key={`${product.slug}-${product.size}`} className="flex mb-5">
                        <ProductImage
                            src={product.image}
                            alt={product.title}
                            width={100}
                            style={{
                                width: '100px',
                                height: '100px',
                            }}
                            height={100}
                            className="mr-5 rounded"
                        />
                        <div>
                            <Link className="hover:underline cursor-pointer" href={`/product/${product.slug}`}>
                                {product.title}
                            </Link>
                            <p>Talle: {product.size}</p>
                            <p>${product.price}</p>
                            <QuantitySelector
                                onQuantityChanged={(value) => updateProductQuantity(product, value)}
                                quantity={product.quantity}/>
                            <button
                                onClick={() => removeProductFromCart(product)}
                                className="underline mt-3 cursor-pointer">
                                Remover
                            </button>
                        </div>
                    </div>
                ))
            }
        </>
    )
}
