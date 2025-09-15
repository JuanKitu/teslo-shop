'use client';
import React, {useEffect, useState} from 'react'
import {titleFont} from "@/app/config/fonts";
import {getStockBySlug} from "@/actions/product/get-stock-by-slug";

interface Props {
    slug: string;
}

export function StockLabel({slug}: Props) {
    const [stock, setStock] = useState(0);
    const [isLoading, setIsLoading] = useState(true)
    useEffect(() => {
        getStock().then();
    })
    const getStock = async () => {
        const inStock = await getStockBySlug(slug);
        setStock(inStock);
        setIsLoading(false);
    }

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
}
