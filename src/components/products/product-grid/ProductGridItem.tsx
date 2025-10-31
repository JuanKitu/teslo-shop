'use client';
import React, { useState } from 'react';
import { Product } from '@/interfaces';
import Link from 'next/link';
import { ProductImage, FavoriteButton } from '@/components';

interface Props {
  product: Product;
}

export function ProductGridItem({ product }: Props) {
  const [displayImage, setDisplayImage] = useState(product.images[0]);

  const changeImage = (image: number) => {
    setDisplayImage(product.images[image]);
  };

  return (
    <div className="rounded-md overflow-hidden fade-in">
      <div className="relative">
        {/* 📸 Contenedor con proporción fija */}
        <Link href={`/product/${product.slug}`}>
          <div className="aspect-square relative w-full overflow-hidden rounded-2xl">
            <ProductImage
              src={displayImage}
              alt={product.title}
              fill
              className="object-cover transition-transform duration-300 hover:scale-105"
              onMouseEnter={() => changeImage(1)}
              onMouseLeave={() => changeImage(0)}
            />
          </div>
        </Link>

        <div className="absolute top-2 right-2 z-10">
          <FavoriteButton product={product} />
        </div>
      </div>

      <div className="p-4 flex flex-col">
        <Link className="hover:text-blue-600" href={`/product/${product.slug}`}>
          {product.title}
        </Link>
        <span className="font-bold">${product.price}</span>
      </div>
    </div>
  );
}
