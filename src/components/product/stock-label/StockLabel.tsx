'use client';
import React, {useEffect, useState, useImperativeHandle, forwardRef, useCallback} from 'react'
import {titleFont} from "@/app/config/fonts";
import {getStockBySlug} from "@/actions";

interface Props {
    slug: string;
}

export interface StockLabelRef {
    refreshStock: () => Promise<void>;
}

export const StockLabel = forwardRef<StockLabelRef, Props>(({slug}, ref) => {
    const [stock, setStock] = useState(0);
    const [isLoading, setIsLoading] = useState(true)
    
    const getStock = useCallback(async () => {
        setIsLoading(true);
        const inStock = await getStockBySlug(slug);
        setStock(inStock);
        setIsLoading(false);
    }, [slug])

    useImperativeHandle(ref, () => ({
        refreshStock: getStock
    }));

    useEffect(() => {
        getStock().then();
    }, [getStock, slug])

    return (
        <>
            {
                isLoading ?
                    (
                        <h1 className={`${titleFont.className} antialiased text-md font-bold bg-gray-200 animate-pulse`}>
                            &nbsp;
                        </h1>
                    ) :
                    (
                        <h1 className={`${titleFont.className} antialiased text-md font-bold`}>
                            Stock: {stock}
                        </h1>
                    )
            }
        </>
    )
});

StockLabel.displayName = 'StockLabel';
