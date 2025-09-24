import React from 'react'
import {notFound} from "next/navigation";
import {ProductMobileSlideshow, ProductSlideshow} from "@/components";
import {getProductBySlug} from "@/actions";
import {Metadata} from "next";
import {ProductDetails} from "@/app/(shop)/product/[slug]/ui/ProductDetails";

export const revalidate = 604800;// 7 days
interface Props {
    params: Promise<{
        slug: string
    }>
}

export async function generateMetadata(
    {params}: Props): Promise<Metadata> {
    const slug = (await params).slug

    // fetch post information
    const product = await getProductBySlug(slug);

    return {
        title: product?.title,
        description: product?.description ?? '',
        openGraph: {
            title: product?.title,
            description: product?.description ?? '',
            images: [`/products/${product?.images[1]}`]
        }
    }
}

export default async function ProductPage({params}: Props) {
    const {slug} = await params;
    const product = await getProductBySlug(slug);
    if (!product) {
        notFound();
    }
    return (
        <div className="mt-5 mb-20 grid md:grid-cols-3 gap-3">
            {/* Slideshow */}
            <div className="col-span-1 md:col-span-2">
                {/* Mobile Slideshow */}
                <ProductMobileSlideshow
                    title={product.title}
                    images={product.images}
                    className="block md:hidden"
                />

                {/* Desktop Slideshow */}
                <ProductSlideshow
                    title={product.title}
                    images={product.images}
                    className="hidden md:block"
                />
            </div>

            {/* Detalles */}
            <ProductDetails product={product} slug={slug} />

        </div>
    )
}
