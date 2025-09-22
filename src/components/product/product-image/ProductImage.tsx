import React from 'react'
import Image from "next/image";
interface Props {
    src?: string;
    alt: string;
    className?: React.StyleHTMLAttributes<HTMLImageElement>['className'];
    width: number;
    style?: React.StyleHTMLAttributes<HTMLImageElement>['style'];
    height: number;
}
export function ProductImage({
                                 src,
                                 alt,
                                 className,
                                 width,
                                 height,
                                 style
                             }:Props) {
    const localSrc =(src) ?  src?.startsWith('http')
        ? src
        : `/products/${src}`
        : '/imgs/placeholder.jpg';
    return (
        <Image
            src={localSrc}
            alt={alt}
            style={style}
            width={width}
            height={height}
            className={className}
        />
    )
}
