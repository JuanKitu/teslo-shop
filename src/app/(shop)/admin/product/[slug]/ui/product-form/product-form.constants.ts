import type { Gender } from '@/interfaces';
import type { VariantInput } from './product-form.interface';

export const GENDERS: Gender[] = [
  { id: 'men', name: 'Hombre' },
  { id: 'women', name: 'Mujer' },
  { id: 'kid', name: 'Niño' },
  { id: 'unisex', name: 'Unisex' },
];

// ✅ Sin 'as const' para que sea mutable
export const VALID_SIZES: string[] = ['GENERIC', 'XS', 'S', 'M', 'L', 'XL', 'XXL'];

// O si prefieres con objetos (mejor opción)
export const SIZE_OPTIONS = [
  { value: 'GENERIC', label: 'Genérico' },
  { value: 'XS', label: 'XS' },
  { value: 'S', label: 'S' },
  { value: 'M', label: 'M' },
  { value: 'L', label: 'L' },
  { value: 'XL', label: 'XL' },
  { value: 'XXL', label: 'XXL' },
];

export const DEFAULT_VARIANT: VariantInput = {
  color: '',
  size: 'GENERIC',
  price: 0,
  inStock: 0,
  images: [],
};
