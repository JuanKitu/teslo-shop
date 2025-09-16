'use client';
import React, {useState} from 'react'
import {QuantitySelector, SizeSelector} from "@/components";
import type {Product, Size} from "@/interfaces";
import {useCartStore} from "@/store";
interface Props {
    product:Product;
}
export function AddToCart({product}: Props) {
    const [size, setSize] = useState<Size | undefined>();
    const [quantity, setQuantity] = useState<number>(1);
    const [posted, setPosted] = useState(false);
    const addProductToCart = useCartStore(state => state.addProductToCart);
    const addToCart = () => {
        if(!size){
            setPosted(true);
            return;
        }
        addProductToCart({
            id: product.id,
            slug: product.slug,
            image: product.images[0],
            title: product.title,
            price: product.price,
            size,
            quantity,
        });
        setPosted(false);
        setQuantity(1);
        setSize(undefined);
    }
    return (
        <>
            {
                posted && (
                    <span className="text-red-500 mt-2 fade-in">*Debe de seleccionar una talla</span>
                )
            }
            {/* Selector de tallas */}
            <SizeSelector
                availableSizes={product.sizes}
                selectedSize={size}
                onSizeChanged={setSize}
            />

            {/* Selector de cantidad */}
            <QuantitySelector
                quantity={quantity}
                onQuantityChanged={setQuantity}
            />

            {/* Button */}
            <button
                onClick={addToCart}
                className="btn-primary my-5">
                Agregar al carrito
            </button>
        </>
    )
}
