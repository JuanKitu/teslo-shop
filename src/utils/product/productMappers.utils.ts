import type { ProductVariant, VariantOptionValue } from '@/interfaces';

/**
 * Tipo para variante de Prisma con sus relaciones
 */
type PrismaVariant = {
  id: string;
  sku: string | null;
  price: number | null;
  inStock: number;
  isActive: boolean;
  images: Array<{ url: string }>;
  optionValues: Array<{
    id: string;
    optionId: string;
    value: string;
    option: {
      name: string;
      slug: string;
    };
  }>;
};

/**
 * Mapea una variante de Prisma a ProductVariant
 */
export function mapPrismaVariantToProductVariant(variant: PrismaVariant): ProductVariant {
  // Mapear optionValues
  const optionValues: VariantOptionValue[] = variant.optionValues.map((ov) => ({
    id: ov.id,
    optionId: ov.optionId,
    optionName: ov.option.name,
    optionSlug: ov.option.slug,
    value: ov.value,
  }));

  // Extraer color y size de optionValues
  const colorValue = optionValues.find((ov) => ov.optionSlug === 'color');
  const sizeValue = optionValues.find((ov) => ov.optionSlug === 'size');

  return {
    id: variant.id,
    sku: variant.sku,
    price: variant.price,
    inStock: variant.inStock,
    isActive: variant.isActive,
    images: variant.images.map((img) => img.url),
    optionValues,
    color: colorValue?.value,
    size: sizeValue?.value,
  };
}

/**
 * Mapea múltiples variantes de Prisma
 */
export function mapPrismaVariants(variants: PrismaVariant[]): ProductVariant[] {
  return variants.map(mapPrismaVariantToProductVariant);
}

/**
 * Extrae colores disponibles de variantes (solo con stock)
 */
export function extractAvailableColors(variants: ProductVariant[]): string[] {
  return [...new Set(variants.filter((v) => v.inStock > 0 && v.color).map((v) => v.color!))];
}

/**
 * Extrae tallas disponibles de variantes (solo con stock)
 */
export function extractAvailableSizes(variants: ProductVariant[]): string[] {
  return [...new Set(variants.filter((v) => v.inStock > 0 && v.size).map((v) => v.size!))];
}

/**
 * Procesa variantes de Prisma y devuelve todo lo necesario para Product
 */
export function processVariants(prismaVariants: PrismaVariant[]) {
  const variants = mapPrismaVariants(prismaVariants);
  const availableColors = extractAvailableColors(variants);
  const availableSizes = extractAvailableSizes(variants);

  return {
    variants,
    availableColors,
    availableSizes,
  };
}
