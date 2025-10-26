'use client';
import React from 'react';
import { titleFont } from '@/app/config/fonts';
import { useProductSelectionStore } from '@/store';

export function StockLabel() {
  const { selectedVariant } = useProductSelectionStore();

  const stock = selectedVariant?.stock ?? 0;

  return (
    <div className="h-6 flex items-center">
      <h1 className={`${titleFont.className} antialiased text-md font-bold`}>
        {stock > 0 ? `Stock: ${stock}` : 'Sin stock'}
      </h1>
    </div>
  );
}
