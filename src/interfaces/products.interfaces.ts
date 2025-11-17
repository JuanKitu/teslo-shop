// @/interfaces/product.interface.ts

export type Size = 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL' | 'XXXL' | 'GENERIC';

// 🆕 Interfaz para los valores de opciones
export interface VariantOptionValue {
  id: string;
  optionId: string;
  optionName: string;
  optionSlug: string;
  value: string;
}

// ✅ ProductImage ACTUALIZADA (no eliminada)
export interface ProductImage {
  id: number;
  url: string;
  alt?: string | null; // 🆕 Agregado del schema
  order: number; // 🆕 Agregado del schema
  productId: string | null;
  variantId: string | null;
}

export interface ProductVariant {
  id: string;
  sku: string | null;
  price: number | null;
  inStock: number;
  isActive: boolean;
  images: string[];
  optionValues: VariantOptionValue[];

  // Helpers para acceso rápido
  color?: string;
  size?: string;
}

// 🆕 Categoría del nuevo schema
export interface ProductCategory {
  categoryId: string;
  isPrimary: boolean;
  order: number;
  category: {
    id: string;
    name: string;
    slug: string;
  };
}

// 🆕 Marca del nuevo schema
export interface ProductBrand {
  brandId: string;
  isPrimary: boolean;
  order: number;
  brand: {
    id: string;
    name: string;
    slug: string;
  };
}

// ✅ Product actualizado
export interface Product {
  id: string;
  title: string;
  description: string;
  slug: string;
  price: number;
  tags: string[];
  images: string[]; // URLs simplificadas para renderizado rápido

  // Variantes disponibles
  variants: ProductVariant[];

  // Opciones disponibles
  availableColors: string[];
  availableSizes: string[];

  // 🆕 Categorías (opcional - solo para admin/detalle)
  categories?: ProductCategory[];

  // 🆕 Marcas (opcional - solo para admin/detalle)
  brands?: ProductBrand[];

  // ✅ MANTENIDO - Imágenes completas (opcional - para admin/edición)
  ProductImage?: ProductImage[];
}

// ✅ CartProduct (sin cambios mayores)
export interface CartProduct {
  id: string; // productId
  variantId: string; // 🆕 ID de la variante específica
  slug: string;
  image: string;
  inStock: number;
  title: string;
  price: number;
  size: string;
  color: string;
  quantity: number;
}
