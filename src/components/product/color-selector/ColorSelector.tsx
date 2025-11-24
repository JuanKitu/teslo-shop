'use client';
import React, { useState } from 'react';
import type { ProductVariant } from '@/interfaces';
import { useProductSelectionStore } from '@/store';
import { ProductImage } from '@/components';

interface Props {
  variants: ProductVariant[];
}

export function ColorSelector({ variants }: Props) {
  const selectedVariant = useProductSelectionStore((state) => state.selectedVariant);
  const setVariant = useProductSelectionStore((state) => state.setVariant);

  // Estado local para mostrar el color "hover"
  const [hoveredColor, setHoveredColor] = useState<string | null>(null);

  // Agrupar por color (sin duplicados) - solo variantes con color
  const variantList = Array.from(
    new Map(
      variants
        .filter((variant) => variant.color) // ✅ Solo variantes con color definido
        .map((variant) => [
          variant.color!,
          { color: variant.color!, image: variant.images[0] || '/imgs/placeholder.jpg' },
        ])
    ).values()
  );

  const selectColor = (color: string) => {
    // Buscar variante que coincida con el color y size seleccionado (si existe)
    let variant: ProductVariant | undefined;

    if (selectedVariant?.size) {
      // Si hay size seleccionado, buscar variante exacta
      variant = variants.find(
        (v) => v.color === color && v.size === selectedVariant.size && v.inStock > 0
      );

      // Si no hay stock con ese size, buscar primera variante disponible con ese color
      if (!variant) {
        variant = variants.find((v) => v.color === color && v.inStock > 0);
      }
    } else {
      // Sin size seleccionado, buscar primera variante disponible con ese color
      variant = variants.find((v) => v.color === color && v.inStock > 0);
    }

    // Si no hay variantes con stock, buscar cualquiera con ese color
    if (!variant) {
      variant = variants.find((v) => v.color === color);
    }

    setVariant(variant);
  };

  // Determinar qué texto mostrar en el label
  const displayColor = hoveredColor || selectedVariant?.color || 'Elegí';

  // Verificar si un color está disponible (tiene stock)
  const isColorAvailable = (color: string) => {
    return variants.some((v) => v.color === color && v.inStock > 0);
  };

  return (
    <div className="my-4">
      <h3 className="font-semibold mb-3 text-sm uppercase tracking-wide">
        Color: <span className="font-normal normal-case">{displayColor}</span>
      </h3>

      <div className="flex flex-wrap gap-3">
        {variantList.map((variant) => {
          const isAvailable = isColorAvailable(variant.color);
          const isSelected = selectedVariant?.color === variant.color;

          return (
            <div key={variant.color} className="relative group">
              <button
                onClick={() => selectColor(variant.color)}
                onMouseEnter={() => setHoveredColor(variant.color)}
                onMouseLeave={() => setHoveredColor(null)}
                disabled={!isAvailable}
                className={`relative w-12 h-12 rounded-lg overflow-hidden border transition-all duration-200 ${
                  isSelected
                    ? 'border-blue-500 border-3 scale-105 shadow-md'
                    : isAvailable
                      ? 'border-gray-500 border-3 hover:border-blue-500 hover:scale-105'
                      : 'border-gray-300 border-3 opacity-50 cursor-not-allowed'
                }`}
              >
                <div className="relative w-full h-full">
                  <ProductImage
                    src={variant.image}
                    alt={variant.color}
                    fill
                    className={`object-cover ${!isAvailable ? 'grayscale' : ''}`}
                  />

                  {/* Marca de sin stock */}
                  {!isAvailable && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-full h-0.5 bg-red-500 rotate-45" />
                    </div>
                  )}
                </div>
              </button>

              {/* Tooltip */}
              <div className="absolute -bottom-7 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-xs bg-gray-800 text-white rounded-md px-2 py-1 pointer-events-none whitespace-nowrap z-10">
                {variant.color} {!isAvailable && '(Sin stock)'}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
