import type { Product } from '@/interfaces';

export interface ProductRowProps {
  product: Product;
  isDark: boolean;
}
export interface TableProductAdminProps {
  products: Product[];
}
