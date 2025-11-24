import type { ProductVariant, VariantOptionValue } from '@/interfaces';

/**
 * Obtiene el valor de una opción específica
 */
export function getOptionValue(
  optionValues: VariantOptionValue[],
  optionSlug: string
): string | undefined {
  return optionValues.find((ov) => ov.optionSlug === optionSlug)?.value;
}

/**
 * Extrae color de una variante
 */
export function getVariantColor(variant: {
  optionValues: VariantOptionValue[];
}): string | undefined {
  return getOptionValue(variant.optionValues, 'color');
}

/**
 * Extrae size de una variante
 */
export function getVariantSize(variant: {
  optionValues: VariantOptionValue[];
}): string | undefined {
  return getOptionValue(variant.optionValues, 'size');
}

/**
 * Busca una variante por color y talla
 */
export function findVariantByColorAndSize(
  variants: ProductVariant[],
  color: string,
  size: string
): ProductVariant | undefined {
  return variants.find((variant) => {
    const variantColor = getVariantColor(variant);
    const variantSize = getVariantSize(variant);

    return (
      variantColor?.toLowerCase() === color.toLowerCase() &&
      variantSize?.toLowerCase() === size.toLowerCase()
    );
  });
}

/**
 * Agrupa variantes por color
 */
export function groupVariantsByColor(variants: ProductVariant[]): Record<string, ProductVariant[]> {
  return variants.reduce(
    (acc, variant) => {
      const color = getVariantColor(variant);
      if (!color) return acc;

      if (!acc[color]) {
        acc[color] = [];
      }
      acc[color].push(variant);
      return acc;
    },
    {} as Record<string, ProductVariant[]>
  );
}

/**
 * Obtiene tallas disponibles para un color específico
 */
export function getAvailableSizesForColor(variants: ProductVariant[], color: string): string[] {
  return variants
    .filter((v) => getVariantColor(v)?.toLowerCase() === color.toLowerCase())
    .filter((v) => v.inStock > 0)
    .map((v) => getVariantSize(v))
    .filter((size): size is string => size !== undefined);
}

/**
 * Enriquece variante con helpers (color y size directos)
 */
export function enrichVariant(variant: ProductVariant): ProductVariant {
  return {
    ...variant,
    color: getVariantColor(variant),
    size: getVariantSize(variant),
  };
}
