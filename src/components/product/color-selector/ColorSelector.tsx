'use client';
import React, { useState } from 'react';
import { ProductVariant } from '@/interfaces';
import { useProductSelectionStore } from '@/store';
import { ProductImage } from '@/components';

interface Props {
  variants: ProductVariant[];
}

export function ColorSelector({ variants }: Props) {
  const selectedVariant = useProductSelectionStore((state) => state.selectedVariant);
  const setVariant = useProductSelectionStore((state) => state.setVariant);

  //Estado local para mostrar el color "hover"
  const [hoveredColor, setHoveredColor] = useState<string | null>(null);
  //Agrupar por color (sin duplicados)
  const variantList = Array.from(
    new Map(
      variants.map((variant) => [variant.color, { color: variant.color, image: variant.images[0] }])
    ).values()
  );

  const selectColor = (color: string) => {
    const variant = selectedVariant?.size
      ? variants.find((variant) => variant.color === color && variant.size === selectedVariant.size)
      : undefined;
    setVariant(variant ?? { color, size: 'GENERIC', stock: 0, images: [], price: null });
  };
  //Determinar qué texto mostrar en el label
  const displayColor = hoveredColor || selectedVariant?.color || 'Elegí';
  return (
    <div className="my-4">
      <h3 className="font-semibold mb-3 text-gray-800 text-sm uppercase tracking-wide">
        Color: <span className="font-normal normal-case">{displayColor}</span>
      </h3>

      <div className="flex flex-wrap gap-3">
        {variantList.map((variant) => (
          <div key={variant.color} className="relative group">
            <button
              onClick={() => selectColor(variant.color)}
              onMouseEnter={() => setHoveredColor(variant.color)}
              onMouseLeave={() => setHoveredColor(null)}
              className={`relative w-12 h-12 rounded-lg overflow-hidden border transition-all duration-200 ${
                selectedVariant?.color === variant.color
                  ? 'border-black scale-105 shadow-md'
                  : 'border-gray-300 hover:border-black hover:scale-105'
              }`}
            >
              <div className="relative w-full h-full">
                <ProductImage
                  src={variant.image}
                  alt={variant.color}
                  fill
                  className="object-cover"
                />
              </div>
            </button>

            {/* Tooltip */}
            <div className="absolute -bottom-7 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-xs bg-gray-800 text-white rounded-md px-2 py-1 pointer-events-none whitespace-nowrap">
              {variant.color}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
