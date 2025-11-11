import React from 'react';
import { Title } from '@/components';
import { getCategories, getProductBySlug } from '@/actions';
import { redirect } from 'next/navigation';
import { ProductForm } from './ui/product-form/ProductForm';
interface Props {
  params: Promise<{
    slug: string;
  }>;
}
export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  const categories = await getCategories();
  if (!product && slug !== 'new') {
    redirect('/admin/products');
  }
  const title = slug === 'new' ? 'Nuevo Producto' : 'Editar Producto';
  return (
    <>
      <Title title={title} />
      <ProductForm product={product ?? {}} categories={categories} />
    </>
  );
}
