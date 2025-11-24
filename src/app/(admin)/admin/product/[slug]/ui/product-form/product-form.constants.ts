import type { VariantInput } from './product-form.interface';

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
