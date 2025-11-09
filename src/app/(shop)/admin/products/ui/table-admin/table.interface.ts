import { Product } from '@/interfaces';

export interface TableProductAdminProps {
  products: Product[];
}
type Category = 'men' | 'women' | 'kid' | 'unisex';
export const labelCategory: Record<Category, string> = {
  men: 'Hombre',
  women: 'Mujer',
  kid: 'Niño',
  unisex: 'Unisex',
};
export interface ProductRowProps {
  product: Product;
  isDark: boolean;
}
