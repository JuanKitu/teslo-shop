import type { UseFormRegister, FieldErrors, Control, FieldArrayWithId } from 'react-hook-form';
import type { Product, Category } from '@/interfaces';

export interface VariantInput {
  color: string;
  size: string;
  price: number;
  inStock: number;
  sku?: string;
  images?: string[];
}

export interface FormInputs {
  title: string;
  slug: string;
  description: string;
  tags: string;
  price: number;
  categoryIds: string[];
  brandId?: string;
  images?: (File | string)[];
  variants: VariantInput[];
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
  product?: ProductFormData; // ✅ Compatible con Product
  categories: Category[];
  brands?: Brand[];
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
export interface Brand {
  id: string;
  name: string;
  slug: string;
}
