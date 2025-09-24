'use client';
import React, {useState} from 'react'
import {QuantitySelector, SizeSelector} from "@/components";
import type {Product, Size} from "@/interfaces";
import {useCartStore} from "@/store";
import {addToCartWithStockValidation} from "@/actions";
interface Props {
    product:Product;
    onStockError?: () => void;
}
export function AddToCart({product, onStockError}: Props) {
    const [size, setSize] = useState<Size | undefined>();
    const [quantity, setQuantity] = useState<number>(1);
    const [posted, setPosted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string>('');
    const addProductToCart = useCartStore(state => state.addProductToCart);
    
    const addToCart = async () => {
        if(!size){
            setPosted(true);
            return;
        }

        setIsLoading(true);
        setErrorMessage('');

        try {
            // Validar stock en el servidor
            const result = await addToCartWithStockValidation(product.slug, quantity);
            if(!result.ok){
                setErrorMessage(result.message);
                // Actualizar el stock mostrado en pantalla
                onStockError?.();
                return;
            }
            // Si hay stock, agregar al carrito
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
            // Si no hay stock, mostrar error

        } catch (error) {
            void error
            setErrorMessage('Error al agregar el producto al carrito');
        } finally {
            setIsLoading(false);
        }
    }
    return (
        <>
            {
                posted && (
                    <span className="text-red-500 mt-2 fade-in">*Debe de seleccionar una talla</span>
                )
            }
            {
                errorMessage && (
                    <span className="text-red-500 mt-2 fade-in block">{errorMessage}</span>
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
                totalStock={product.inStock}
                quantity={quantity}
                onQuantityChanged={setQuantity}
            />

            {/* Button */}
            <button
                onClick={addToCart}
                disabled={isLoading}
                className="btn-primary my-5 disabled:opacity-50 disabled:cursor-not-allowed">
                {isLoading ? 'Agregando...' : 'Agregar al carrito'}
            </button>
        </>
    )
}
