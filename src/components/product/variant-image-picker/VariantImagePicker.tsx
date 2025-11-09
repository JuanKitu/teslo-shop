'use client';

import React, { useEffect, useState } from 'react';
import { useController, FieldValues } from 'react-hook-form';
import { useTheme } from 'next-themes';
import { ProductImage } from '@/components';
import { getVariantImagePickerStyles } from './styles';
import type { VariantImagePickerProps } from './variant-image-picker.interface';

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
  thumbSize = 64,
  emptyText = 'No hay imágenes disponibles',
}: VariantImagePickerProps<T>) {
  const [mounted, setMounted] = useState(false);
  const { theme } = useTheme();

  const {
    field: { value = [], onChange },
  } = useController({ name, control });

  useEffect(() => {
    setMounted(true);
  }, []);

  // ✅ Asegurarse que selected siempre sea un array válido
  const selected: string[] = Array.isArray(value) ? value : [];

  const isSelected = (url: string) => selected.includes(url);

  const toggle = (url: string, event: React.MouseEvent<HTMLButtonElement>) => {
    // ✅ Blur para quitar el focus y evitar estilos residuales
    event.currentTarget.blur();

    let newValue: string[];

    if (multiple) {
      if (isSelected(url)) {
        newValue = selected.filter((s) => s !== url);
      } else {
        newValue = [...selected, url];
      }
    } else {
      newValue = isSelected(url) ? [] : [url];
    }

    // ✅ Actualizar el valor
    onChange(newValue);
  };

  // Evitar problemas de hidratación
  if (!mounted) {
    return <div className="h-16 bg-gray-100 dark:bg-gray-800 animate-pulse rounded-md" />;
  }

  const isDark = theme === 'dark';
  const styles = getVariantImagePickerStyles(isDark);

  // Estado vacío
  if (!images || images.length === 0) {
    return <div className={styles.emptyState}>{emptyText}</div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className={styles.label}>
          Imágenes de la variante {multiple && selected.length > 0 && `(${selected.length})`}
        </label>
        {selected.length > 0 && (
          <span className={styles.badge}>
            {selected.length} seleccionada{selected.length !== 1 ? 's' : ''}
          </span>
        )}
      </div>

      <div className={styles.container}>
        {images.map((url, idx) => {
          // ✅ Recalcular en cada render
          const isCurrentSelected = isSelected(url);

          return (
            <button
              type="button"
              key={`${url}-${idx}`}
              onClick={(e) => toggle(url, e)}
              className={styles.imageButton(isCurrentSelected)}
              style={{
                width: thumbSize,
                height: thumbSize,
              }}
              aria-pressed={isCurrentSelected}
              aria-label={`Imagen ${idx + 1} ${isCurrentSelected ? 'seleccionada' : 'no seleccionada'}`}
            >
              <ProductImage
                src={url}
                alt={`Imagen del producto ${idx + 1}`}
                fill
                className="object-cover"
              />

              {/* Overlay check */}
              <span className={styles.overlay(isCurrentSelected)}>
                {isCurrentSelected ? '✓' : idx + 1}
              </span>

              {/* Efecto de selección - Solo cuando está seleccionado */}
              {isCurrentSelected && (
                <div
                  className="absolute inset-0 bg-blue-500/10 pointer-events-none"
                  key={`overlay-${isCurrentSelected}`}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Ayuda contextual */}
      <p className={`text-xs mt-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
        {multiple
          ? 'Selecciona una o más imágenes para esta variante'
          : 'Selecciona una imagen para esta variante'}
      </p>
    </div>
  );
}
