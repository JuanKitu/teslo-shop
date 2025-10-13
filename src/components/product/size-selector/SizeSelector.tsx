'use client';
import React from 'react';
import clsx from 'clsx';
import type { ProductVariant } from '@/interfaces';
import { useProductSelectionStore } from '@/store';

interface Props {
    variants: ProductVariant[];
}

export function SizeSelector({ variants }: Props) {
    const { selectedVariant, setVariant } = useProductSelectionStore();

    // Filtrar variantes por color seleccionado
    const selectedColor = selectedVariant?.color;
    const filteredVariants = selectedColor
        ? variants.filter((v) => v.color === selectedColor)
        : [];

    const availableSizes = filteredVariants.filter(v => v.stock > 0).map(v => v.size);

    return (
        <div className="my-5">
            <h3 className="font-bold mb-2">Tallas disponibles</h3>
            <div className="flex flex-wrap gap-2">
                {availableSizes.length > 0 ? (
                    availableSizes.map((size) => {
                        const variant = filteredVariants.find(v => v.size === size)!;
                        return (
                            <button
                                key={size}
                                className={clsx(
                                    'px-3 py-1 rounded border transition-colors',
                                    size === selectedVariant?.size
                                        ? 'border-black font-semibold'
                                        : 'border-gray-300 hover:border-black'
                                )}
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
