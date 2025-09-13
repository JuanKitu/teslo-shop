import React from 'react'
import {initialData} from "@/seed/seed";
import {notFound} from "next/navigation";
import {titleFont} from "@/app/config/fonts";
import {QuantitySelector, SizeSelector} from "@/components";
interface Props {
    params: Promise<{
        slug: string
    }>
}
export default async function ProductPage({params}: Props) {
    const {slug} = await params;
    const product = initialData.products.find(product => product.slug === slug);
    if(!product){
        notFound();
    }
    return (
        <div className="mt-5 mb-20 grid md:grid-cols-3 gap-3">
            {/* Slideshow */}
            <div className="col-span-1 md:col-span-2">

            </div>

            {/* Detalles */}
            <div className="col-span-1 px-5">
                <h1 className={`${titleFont.className} antialiased text-xl font-bold`}>
                    {product.title}
                </h1>
                <p className="text-lg mb-5">${product.price}</p>
                {/* Selector de tallas */}
                <SizeSelector availableSizes={product.sizes} selectedSize={product.sizes[1]} />

                {/* Selector de cantidad */}
                <QuantitySelector quantity={5} />

                {/* Button */}
                <button className="btn-primary my-5">
                    Agregar al carrito
                </button>
                {/* Descripción */}
                <h3 className="font-bold text-sm">Descripción</h3>
                <p className="font-light">{product.description}</p>

            </div>

        </div>
    )
}
