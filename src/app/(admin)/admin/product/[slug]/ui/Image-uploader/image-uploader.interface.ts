import type { ProductImage as IProductImage } from '@/interfaces';
import { DropzoneInputProps, DropzoneRootProps } from 'react-dropzone';

export interface ImageUploaderProps {
  initialImages?: IProductImage[];
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
