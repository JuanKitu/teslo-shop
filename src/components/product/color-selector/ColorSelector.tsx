'use client';
import React from 'react';
import { ProductVariant } from '@/interfaces';
import { useProductSelectionStore } from '@/store';

interface Props {
  variants: ProductVariant[];
}

export function ColorSelector({ variants }: Props) {
  const selectedVariant = useProductSelectionStore((state) => state.selectedVariant);
  const setVariant = useProductSelectionStore((state) => state.setVariant);
  const colors = Array.from(new Set(variants.map((v) => v.color))).filter(Boolean);
  const selectColor = (color: string) => {
    const variant = selectedVariant?.size
      ? variants.find((variant) => variant.color === color && variant.size === selectedVariant.size)
      : undefined;
    setVariant(variant ?? { color, size: 'GENERIC', stock: 0, images: [] });
  };
  return (
    <div className="my-3">
      <h3 className="font-bold mb-2">Colores disponibles</h3>
      <div className="flex flex-wrap gap-2">
        {colors.map((c) => (
          <button
            key={c}
            onClick={() => selectColor(c)}
            className={`px-3 py-1 rounded border transition-colors ${
              selectedVariant?.color === c
                ? 'border-black font-semibold'
                : 'border-gray-300 hover:border-black'
            }`}
          >
            {c}
          </button>
        ))}
      </div>
    </div>
  );
}
