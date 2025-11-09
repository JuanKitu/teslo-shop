'use client';
import React, { useState } from 'react';
import clsx from 'clsx';
import type { ProductVariant } from '@/interfaces';
import { useProductSelectionStore } from '@/store';

interface Props {
  variants: ProductVariant[];
}

export function SizeSelector({ variants }: Props) {
  const { selectedVariant, setVariant } = useProductSelectionStore();
  //Estado local para mostrar el color "hover"
  const [hoveredSize, setHoveredSize] = useState<string | null>(null);
  // Filtrar variantes por color seleccionado
  const selectedColor = selectedVariant?.color;
  const filteredVariants = selectedColor
    ? variants.filter((variant) => variant.color === selectedColor)
    : [];

  const availableSizes = filteredVariants.filter((variant) => variant.stock > 0).map((v) => v.size);
  const displaySize =
    hoveredSize ||
    (selectedVariant?.size === 'GENERIC' ? 'Elegí' : selectedVariant?.size || 'Elegí');
  return (
    <div className="my-5">
      <h3 className="font-bold mb-2">
        Talla: <span className="font-normal normal-case">{displaySize}</span>
      </h3>
      <div className="flex flex-wrap gap-2">
        {availableSizes.length > 0 ? (
          availableSizes.map((size) => {
            const variant = filteredVariants.find((variant) => variant.size === size)!;
            return (
              <button
                key={size}
                className={clsx(
                  'px-3 py-1 rounded border transition-colors',
                  size === selectedVariant?.size
                    ? 'border-blue-500 border-3 font-semibold'
                    : 'border-gray-500 border-3 hover:border-blue-500'
                )}
                onMouseEnter={() => setHoveredSize(variant.size)}
                onMouseLeave={() => setHoveredSize(null)}
                onClick={() => setVariant(variant)}
              >
                {size}
              </button>
            );
          })
        ) : (
          <p className="text-gray-500 text-sm">Selecciona un color primero</p>
        )}
      </div>
    </div>
  );
}
