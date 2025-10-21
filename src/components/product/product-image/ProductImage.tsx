import React from 'react'
import Image from "next/image";
interface Props {
    src?: string;
    alt: string;
    className?: React.StyleHTMLAttributes<HTMLImageElement>['className'];
    width?: number;
    style?: React.StyleHTMLAttributes<HTMLImageElement>['style'];
    height?: number;
    fill?: boolean;
    onMouseEnter?: () => void;
    onMouseLeave?: () => void;
}
export function ProductImage({
                                 src,
                                 alt,
                                 className,
                                 width,
                                 height,
                                 fill,
                                 style,
                                 onMouseEnter,
                                 onMouseLeave,
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
            fill={fill}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            height={height}
            className={className}
        />
    )
}
