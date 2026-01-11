import type { UseFormRegister, FieldErrors, Control, FieldArrayWithId } from 'react-hook-form';
import type { Product, Category } from '@/interfaces';

// Dynamic variant option value
export interface VariantOptionValue {
  optionId: string; // ID de la VariantOption (Color, Size, etc.)
  value: string; // Valor seleccionado ("Red", "Large", etc.)
  globalValueId?: string; // ID del GlobalValue si fue seleccionado de la lista
}

export interface VariantInput {
  // Dynamic attributes (new system)
  optionValues?: VariantOptionValue[];

  // Legacy fields (for backward compatibility)
  color?: string;
  size?: string;

  // Common fields
  price: number;
  salePrice?: number; // NEW: variant-specific sale price
  inStock: number;
  sku?: string;
  barcode?: string; // NEW
  images?: string[];
}

export interface FormInputs {
  title: string;
  slug: string;
  description: string;
  tags: string;

  // Pricing
  price: number;
  salePrice?: number | null;
  costPerItem?: number | null;

  // Inventory
  trackQuantity?: boolean;
  sku?: string;
  barcode?: string;
  quantity?: number;

  // Shipping
  weight?: number | null;
  weightUnit?: string;
  length?: number | null;
  width?: number | null;
  height?: number | null;
  dimUnit?: string;

  // Google Shopping / Instagram
  mpn?: string;
  ageGroup?: string;
  gender?: string;

  // SEO
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;

  // Organization
  categoryIds: string[];
  brandId?: string;

  // Media
  images?: (File | string)[];

  // Variants
  variants: VariantInput[];

  // Related Products (handled separately)
  upsellIds?: string[];
  crossSellIds?: string[];
}

// 🆕 Tipo que extiende Product y agrega campos opcionales de admin
export type ProductFormData = Product & {
  // ✅ Campos adicionales solo para admin (si los necesitas)
  ProductImage?: Array<{
    id: number;
    url: string;
    alt?: string | null;
    order: number;
    productId: string | null;
    variantId: string | null;
  }>;

  categories?: Array<{
    categoryId: string;
    category: {
      id: string;
      name: string;
      slug: string;
    };
  }>;

  brands?: Array<{
    brandId: string;
    brand: {
      id: string;
      name: string;
      slug: string;
    };
  }>;
};

export interface ProductFormProps {
  product?: ProductFormData; //  ✅ Compatible con Product
  categories: Category[];
  brands?: Brand[];
  variantOptions: VariantOptionWithValues[];
}

export interface Brand {
  id: string;
  name: string;
  slug: string;
}

export interface ProductInfoSectionProps {
  register: UseFormRegister<FormInputs>;
  errors: FieldErrors<FormInputs>;
  control: Control<FormInputs>;
  categories: Category[];
  brands?: Brand[];
  isValid: boolean;
  errorMessage: string | null;
  isSubmitting: boolean;
  isDark: boolean;
}

export interface VariantsSectionProps {
  control: Control<FormInputs>;
  register: UseFormRegister<FormInputs>;
  fields: FieldArrayWithId<FormInputs, 'variants'>[];
  append: (variant: VariantInput) => void;
  remove: (index: number) => void;
  combinedImages: string[];
  isDark: boolean;
}

// Variant option with global values (from DB)
export interface GlobalValue {
  id: string;
  value: string;
  colorHex: string | null;
  order: number;
}

export interface VariantOptionWithValues {
  id: string;
  name: string;
  slug: string;
  type: 'TEXT' | 'COLOR' | 'SIZE' | 'SELECT' | 'NUMBER';
  description: string | null;
  placeholder: string | null;
  isRequired: boolean;
  isFilterable: boolean;
  position: number;
  globalValues: GlobalValue[];
}
