import type { UseFormRegister, FieldErrors, Control, FieldArrayWithId } from 'react-hook-form';
import type {
  Product,
  ProductVariant,
  ProductImage as ProductWithImage,
  Category,
} from '@/interfaces';

export interface VariantInput {
  color: string;
  size: string;
  price: number;
  inStock: number;
  images?: string[];
}

export interface FormInputs {
  title: string;
  slug: string;
  description: string;
  tags: string;
  price: number;
  gender: 'men' | 'women' | 'kid' | 'unisex';
  categoryId: string;
  images?: string[];
  variants: VariantInput[];
}

export interface ProductFormProps {
  product?: Partial<Product> & {
    ProductImage?: ProductWithImage[];
    variants?: (ProductVariant | VariantInput)[];
  };
  categories: Category[];
}

export interface ProductInfoSectionProps {
  register: UseFormRegister<FormInputs>;
  errors: FieldErrors<FormInputs>;
  categories: Category[];
  isValid: boolean;
  errorMessage: string | null;
  isDark: boolean;
}

export interface VariantsSectionProps {
  control: Control<FormInputs>;
  register: UseFormRegister<FormInputs>;
  fields: FieldArrayWithId<FormInputs, 'variants', 'id'>[];
  append: (variant: VariantInput) => void;
  remove: (index: number) => void;
  combinedImages: string[];
  isDark: boolean;
}
