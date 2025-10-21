export type Size = 'XS'|'S'|'M'|'L'|'XL'|'XXL'|'XXXL' | 'GENERIC';
export interface Product {
    id: string;
    description: string;
    images: string[];
    price: number;
    slug: string;
    tags: string[];
    title: string;
    categoryId: string,
    variants: ProductVariant[];
    gender: Category;
    ProductImage: ProductImage[];
}
export interface ProductVariant {
    color: string;
    size: Size;
    stock: number;
    images: string[];
}
export interface ProductImage {
    id: number;
    url: string;
    productId: string | null;
    variantId: string | null;
}
type Category = 'men'|'women'|'kid'|'unisex';
export const labelCategory:Record<Category, string> = {
    men: 'Hombre',
    women: 'Mujer',
    kid: 'Niño',
    unisex: 'Unisex',
}
export interface CartProduct{
    id: string;
    slug: string;
    image: string;
    inStock: number;
    title: string;
    price: number;
    size: Size;
    color: string;
    quantity: number;
}