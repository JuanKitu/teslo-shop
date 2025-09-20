'use client';
import React, {useEffect, useState} from 'react'
import Image from "next/image";
import {useCartStore} from "@/store";
import {ProductsInCartLoading} from "@/app/(shop)/cart/ui/ProductsInCartLoading";
import {currencyFormat} from "@/utils";

export function ProductsInCart() {
    const [loaded, setLoaded] = useState(false)
    const productsInCart = useCartStore(state => state.cart);
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
                        <Image
                            src={`/products/${product.image}`}
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
                            <span>
                                {product.title} - {product.quantity} unidades
                            </span>
                            <p>Talle: {product.size}</p>
                            <p>Precio unitario: {currencyFormat(product.price)}</p>
                            <p className="font-bold">Total: {currencyFormat(product.price * product.quantity)}</p>
                        </div>
                    </div>
                ))
            }
        </>
    )
}
