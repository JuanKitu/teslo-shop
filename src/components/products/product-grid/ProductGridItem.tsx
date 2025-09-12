'use client'
import React, {useState} from 'react'
import {Product} from "@/interfaces";
import Image from "next/image"
import Link from "next/link";
interface Props {
    product: Product;
}
export function ProductGridItem({product}: Props) {
    const [displayImage, setDisplayImage] = useState(product.images[0]);
    const changeImage = (image: number) => {
        setDisplayImage(product.images[image]);
    }
    return (
        <div className="rounder-md overflow-hidden fade-in">
            <Link href={`/product/${product.slug}`}>
            <Image
                src={`/products/${displayImage}`}
                alt={product.title}
                className="w-full object-cover rounded-2xl"
                width={500}
                height={500}
                onMouseEnter={() => changeImage(1)}
                onMouseLeave={() => changeImage(0)}
            />
            </Link>
            <div className="p-4 flex flex-col">
                <Link
                    className="hover:text-blue-600"
                    href={`/product/${product.slug}`}>
                    {product.title}
                </Link>
                <span className="font-bold">${product.price}</span>
            </div>

        </div>
    )
}
