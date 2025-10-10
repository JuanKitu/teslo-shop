'use client';
import React, {useEffect, useState, useRef} from 'react';
import {toast} from 'sonner';
import {useCartStore} from "@/store";
import {ProductImage, QuantitySelector} from "@/components";
import {ProductsInCartLoading} from "@/app/(shop)/cart/ui/ProductsInCartLoading";
import Link from "next/link";
import {validateCartStock} from "@/actions";
import {CartWarning} from "@/app/(shop)/cart/ui/CartWarning";

interface StockWarning {
    slug: string;
    message: string;
}

interface AdjustedItem {
    slug: string;
    newQuantity: number;
    title: string;
}

interface ValidateCartStockResult {
    ok: boolean;
    adjustedItems?: AdjustedItem[];
}

export function ProductsInCart() {
    const [loaded, setLoaded] = useState(false);
    const [warnings, setWarnings] = useState<StockWarning[]>([]);
    const debounceRef = useRef<NodeJS.Timeout | null>(null);

    const updateProductQuantity = useCartStore(state => state.updateProductQuantity);
    const removeProductFromCart = useCartStore(state => state.removeProductFromCart);
    const updateProductQuantityBySlug = useCartStore(state => state.updateProductQuantityBySlug);
    const cart = useCartStore(state => state.cart);

    useEffect(() => setLoaded(true), []);

    useEffect(() => {
        // limpiar timer anterior
        if (debounceRef.current) clearTimeout(debounceRef.current);

        debounceRef.current = setTimeout(async () => {
            const result: ValidateCartStockResult = await validateCartStock(
                cart.map(item => ({slug: item.slug, quantity: item.quantity}))
            );

            const adjusted = result.adjustedItems ?? [];
            if (!result.ok && adjusted.length > 0) {
                const newWarnings: StockWarning[] = adjusted.map(item => {
                    updateProductQuantityBySlug(item.slug, item.newQuantity); // actualiza store
                    const message = `Solo quedan ${item.newQuantity} unidades`;
                    toast.warning(message);
                    return {slug: item.slug, message};
                });

                setWarnings(prev => {
                    const merged = [...prev];
                    newWarnings.forEach(w => {
                        if (!merged.some(x => x.slug === w.slug)) merged.push(w);
                    });
                    return merged;
                });
            }
        }, 1500);

        return () => {
            if (debounceRef.current) clearTimeout(debounceRef.current);
        };
    }, [cart, updateProductQuantityBySlug]); // ✅ ESLint OK

    // limpiar warnings si el producto fue eliminado o corregido
    useEffect(() => {
        setWarnings(prev =>
            prev.filter(w => cart.some(item => item.slug === w.slug && item.quantity > 0))
        );
    }, [cart]);

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
