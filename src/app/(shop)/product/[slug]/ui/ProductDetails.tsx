'use client';
import React, { useRef } from 'react';
import { titleFont } from "@/app/config/fonts";
import { StockLabel, StockLabelRef } from "@/components";
import { AddToCart } from "./AddToCart";
import type { Product } from "@/interfaces";

interface Props {
    product: Product;
    slug: string;
}

export function ProductDetails({ product, slug }: Props) {
    const stockLabelRef = useRef<StockLabelRef>(null);

    const handleStockError = () => {
        // Actualizar el stock cuando hay un error
        stockLabelRef.current?.refreshStock();
    };

    return (
        <div className="col-span-1 px-5">
            <StockLabel ref={stockLabelRef} slug={slug} />
            <h1 className={`${titleFont.className} antialiased text-xl font-bold`}>
                {product.title}
            </h1>
            <p className="text-lg mb-5">${product.price}</p>

            <AddToCart product={product} onStockError={handleStockError} />
            
            {/* Descripción */}
            <h3 className="font-bold text-sm">Descripción</h3>
            <p className="font-light">{product.description}</p>
        </div>
    );
}
