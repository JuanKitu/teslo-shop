import type { DropzoneInputProps, DropzoneRootProps } from 'react-dropzone';
import { ProductImage } from '@/interfaces';

// 🆕 Tipo flexible para imágenes iniciales
export type InitialImage =
  | string // URLs simples
  | { url: string } // Objeto mínimo
  | ProductImage;

export interface ImageUploaderProps {
  initialImages?: InitialImage[]; // ✅ Acepta múltiples formatos
  onChange: (urls: string[]) => void;
  maxImages?: number;
}

export interface DropZoneProps {
  isDragActive: boolean;
  getRootProps: <T extends DropzoneRootProps>(props?: T) => T;
  getInputProps: <T extends DropzoneInputProps>(props?: T) => T;
  isDark: boolean;
  disabled: boolean;
}

export interface ImageGridProps {
  images: string[];
  onDelete: (url: string) => void;
  isDark: boolean;
}

export interface LoadingSpinnerProps {
  isDark: boolean;
}
