'use client';
import React, { useEffect } from 'react';
import { titleFont } from '@/app/config/fonts';
import { AddToCart } from './AddToCart';
import type { Product } from '@/interfaces';
import { useProductSelectionStore } from '@/store';

interface Props {
  product: Product;
  slug: string;
}

export function ProductDetails({ product, slug }: Props) {
  const resetSelection = useProductSelectionStore((state) => state.reset);

  // Limpia selección al montar/desmontar
  useEffect(() => {
    resetSelection();
  }, [resetSelection, slug]);

  return (
    <div className="col-span-1 px-5">
      <h1 className={`${titleFont.className} antialiased text-xl font-bold`}>{product.title}</h1>

      <p className="text-lg mb-5">${product.price}</p>

      <AddToCart product={product} />

      <h3 className="font-bold text-sm mt-5">Descripción</h3>
      <p className="font-light">{product.description}</p>
    </div>
  );
}
