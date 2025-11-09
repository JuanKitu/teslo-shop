import { Control, FieldValues, Path } from 'react-hook-form';

export interface VariantImagePickerProps<T extends FieldValues> {
  /** Control de react-hook-form */
  control: Control<T>;
  /** Nombre del campo (ej: `variants.0.images`) */
  name: Path<T>;
  /** Array de URLs de imágenes disponibles */
  images: string[];
  /** Permite selección múltiple */
  multiple?: boolean;
  /** Tamaño del thumbnail en px */
  thumbSize?: number;
  /** Texto cuando no hay imágenes */
  emptyText?: string;
}
