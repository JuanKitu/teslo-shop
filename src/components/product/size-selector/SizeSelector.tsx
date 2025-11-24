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
  const [hoveredSize, setHoveredSize] = useState<string | null>(null);
  // Filtrar variantes por color seleccionado
  const selectedColor = selectedVariant?.color;
  const filteredVariants = selectedColor
    ? variants.filter((variant) => variant.color === selectedColor && variant.size) // ✅ Solo con size definido
    : [];

  // Obtener sizes únicos disponibles con stock
  const availableSizes = Array.from(
    new Set(
      filteredVariants
        .filter((variant) => variant.inStock > 0) // ✅ stock → inStock
        .map((v) => v.size!)
    )
  );

  // Determinar qué texto mostrar en el label
  const displaySize = hoveredSize || selectedVariant?.size || 'Elegí';

  return (
    <div className="my-5">
      <h3 className="font-bold mb-2">
        Talla: <span className="font-normal normal-case">{displaySize}</span>
      </h3>

      <div className="flex flex-wrap gap-2">
        {availableSizes.length > 0 ? (
          availableSizes.map((size) => {
            // Buscar variante exacta con ese color y size
            const variant = filteredVariants.find((v) => v.size === size && v.inStock > 0)!;

            const isSelected = size === selectedVariant?.size;

            return (
              <button
                key={size}
                className={clsx(
                  'px-3 py-1 rounded border transition-colors',
                  isSelected
                    ? 'border-blue-500 border-3 font-semibold'
                    : 'border-gray-500 border-3 hover:border-blue-500'
                )}
                onMouseEnter={() => setHoveredSize(size)} // ✅ size ya es string, no undefined
                onMouseLeave={() => setHoveredSize(null)}
                onClick={() => setVariant(variant)}
              >
                {size}
              </button>
            );
          })
        ) : (
          <p className="text-gray-500 text-sm">
            {selectedColor ? 'Sin tallas disponibles' : 'Selecciona un color primero'}
          </p>
        )}
      </div>
    </div>
  );
}
