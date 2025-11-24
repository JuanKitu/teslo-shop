import React from 'react';
import { Title } from '@/components';
import { getBrands, getCategories, getProductBySlugForAdmin } from '@/actions';
import { redirect } from 'next/navigation';
import { ProductForm } from './ui/product-form/ProductForm';
interface Props {
  params: Promise<{
    slug: string;
  }>;
}
export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProductBySlugForAdmin(slug);
  const categories = await getCategories();
  const brands = await getBrands();
  if (!product && slug !== 'new') {
    redirect('/admin/products');
  }
  const title = slug === 'new' ? 'Nuevo Producto' : 'Editar Producto';
  return (
    <>
      <Title title={title} />
      <ProductForm product={product ?? undefined} categories={categories} brands={brands} />
    </>
  );
}
