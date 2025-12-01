import { getAllProductsForAdmin } from '@/actions';
import React from 'react';
import { ProductsAdminClient } from './ui/ProductsAdminClient';

export const revalidate = 0;

export default async function ProductsAdminPage() {
  const { products } = await getAllProductsForAdmin();

  return <ProductsAdminClient products={products} />;
}
