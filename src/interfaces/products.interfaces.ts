export type Size = 'XS'|'S'|'M'|'L'|'XL'|'XXL'|'XXXL';
export type Type = 'shirts'|'pants'|'hoodies'|'hats';
export interface Product {
    id: string;
    description: string;
    images: string[];
    inStock: number;
    price: number;
    sizes: Size[];
    slug: string;
    tags: string[];
    title: string;
    //type: Type;
    gender: Category;
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
    title: string;
    price: number;
    quantity: number;
    size: Size;
    image: string;
}