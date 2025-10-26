import React from 'react';
import { Pagination, ProductGrid, Title } from '@/components';
import { labelCategory } from '@/interfaces';
import { Gender } from '@prisma/client';
import { getPaginatedProductsWithImages } from '@/actions';
import { notFound } from 'next/navigation';
export const revalidate = 86400; // un dia
interface Props {
  params: Promise<{
    gender: Gender;
  }>;
  searchParams: Promise<{
    page: string;
  }>;
}
export default async function GenderPage({ params, searchParams }: Props) {
  const { gender } = await params;
  if (Gender[gender] === undefined) {
    notFound();
  }
  const findPage = await searchParams;
  const page = findPage.page ? Number(findPage.page) : 1;
  const { products, totalPages } = await getPaginatedProductsWithImages({
    page,
    take: 12,
    gender,
  });
  return (
    <>
      <Title
        title={`Articulos de ${labelCategory[gender]}`}
        subtitle={`Todos los productos`}
        className="mb-2"
      />
      <ProductGrid products={products} />
      <Pagination totalPages={totalPages} />
    </>
  );
}
