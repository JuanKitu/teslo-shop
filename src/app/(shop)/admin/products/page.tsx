import { Pagination, Title } from '@/components';
import { getPaginatedProductsWithImages } from '@/actions';
import React from 'react';
import Link from 'next/link';
import TableProductAdmin from './ui/table-admin/TableProductAdmin';
export const revalidate = 0;
interface Props {
  searchParams: Promise<{
    page: string;
  }>;
}
export default async function ProductsAdminPage({ searchParams }: Props) {
  const findPage = await searchParams;
  const page = findPage.page ? Number(findPage.page) : 1;
  const { products, totalPages } = await getPaginatedProductsWithImages({
    page,
    take: 12,
  });
  return (
    <>
      <Title title="Mantenimiento de productos" />
      <div className="flex justify-end mb-5">
        <Link href="/admin/product/new" className="btn-primary">
          Nuevo Producto
        </Link>
      </div>
      <div className="mb-10">
        <TableProductAdmin products={products} />
        <Pagination totalPages={totalPages} />
      </div>
    </>
  );
}
