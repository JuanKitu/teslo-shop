import React from 'react';
import { Title } from '@/components';
import {
  getBrands,
  getCategories,
  getProductBySlugForAdmin,
  getVariantOptionsWithValues,
} from '@/actions';
import { redirect } from 'next/navigation';
import { ProductForm } from './ui/product-form/ProductForm';

interface Props {
  params: Promise<{
    slug: string;
  }>;
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;

  // Fetch all data in parallel for performance
  const [product, categories, brands, variantOptionsResult] = await Promise.all([
    getProductBySlugForAdmin(slug),
    getCategories(),
    getBrands(),
    getVariantOptionsWithValues(),
  ]);

  if (!product && slug !== 'new') {
    redirect('/admin/products');
  }

  const title = slug === 'new' ? 'Nuevo Producto' : 'Editar Producto';

  return (
    <>
      <Title title={title} />
      <ProductForm
        product={product ?? undefined}
        categories={categories}
        brands={brands}
        variantOptions={variantOptionsResult.options}
      />
    </>
  );
}
