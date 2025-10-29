'use client';
import React from 'react';
import { useController, Control, FieldValues, Path } from 'react-hook-form';
import { ProductImage } from '@/components';

export interface VariantImagePickerProps<T extends FieldValues> {
  /** Control de react-hook-form */
  control: Control<T>;
  /** Nombre del campo (ej: `variants.0.images`) */
  name: Path<T>; // string para permitir paths anidados
  images: string[];
  multiple?: boolean;
  thumbSize?: number;
  emptyText?: string;
}

/**
 * VariantImagePicker conectado a React Hook Form
 * ---------------------------------------------
 * Permite elegir una o varias imágenes de un conjunto disponible, y guarda
 * la selección directamente en el formulario (`variants[i].images`).
 */
export function VariantImagePicker<T extends FieldValues>({
  control,
  name,
  images,
  multiple = false,
  thumbSize = 56,
  emptyText = 'No hay imágenes disponibles',
}: VariantImagePickerProps<T>) {
  const {
    field: { value = [], onChange },
  } = useController({ name, control });

  const selected: string[] = Array.isArray(value) ? value : [];

  const isSelected = (url: string) => selected.includes(url);

  const toggle = (url: string) => {
    if (multiple) {
      if (isSelected(url)) {
        onChange(selected.filter((s) => s !== url));
      } else {
        onChange([...selected, url]);
      }
    } else {
      onChange(isSelected(url) ? [] : [url]);
    }
  };

  if (!images || images.length === 0) {
    return <div className="text-sm text-gray-500">{emptyText}</div>;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {images.map((url, idx) => (
        <button
          type="button"
          key={idx}
          onClick={() => toggle(url)}
          className="relative rounded-md overflow-hidden border transition-transform focus:outline-none focus:ring-2 focus:ring-offset-1"
          style={{
            width: thumbSize,
            height: thumbSize,
            borderColor: isSelected(url) ? 'rgb(37 99 235)' : 'rgba(229,231,235,1)',
            transform: isSelected(url) ? 'scale(1.03)' : 'scale(1)',
          }}
          aria-pressed={isSelected(url)}
          aria-label={`Imagen ${idx + 1} ${isSelected(url) ? 'seleccionada' : ''}`}
        >
          <ProductImage
            src={url}
            alt="imagen del producto"
            fill // usa fill en lugar de width/height
            className="w-full h-full object-cover"
          />
          {/* Overlay check */}
          <span
            className={`absolute top-1 right-1 w-5 h-5 rounded-full flex items-center justify-center text-white text-xs font-semibold`}
            style={{
              background: isSelected(url) ? 'rgb(37 99 235)' : 'rgba(0,0,0,0.45)',
            }}
          >
            {isSelected(url) ? '✓' : ''}
          </span>
        </button>
      ))}
    </div>
  );
}
