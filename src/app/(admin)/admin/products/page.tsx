import { Pagination, Title, TabsNavigation } from '@/components';
import { getPaginatedProductsWithImages } from '@/actions';
import React from 'react';
import Link from 'next/link';
import TableProductAdmin from './ui/table-admin/TableProductAdmin';
import { ProductFilters } from './ui/ProductFilters';

export const revalidate = 0;

interface Props {
  searchParams: Promise<{
    page: string;
  }>;
}

const tabs = [
  { name: 'Productos', href: '/admin/products' },
  { name: 'Categorías', href: '/admin/categories' },
  { name: 'Atributos', href: '/admin/attributes' },
];

export default async function ProductsAdminPage({ searchParams }: Props) {
  const findPage = await searchParams;
  const page = findPage.page ? Number(findPage.page) : 1;
  const { products, totalPages } = await getPaginatedProductsWithImages({
    page,
    take: 12,
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Title title="Productos" />
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Administra el inventario de tu tienda.
        </p>
      </div>

      {/* Tabs Navigation */}
      <TabsNavigation tabs={tabs} />

      {/* Filters and Actions */}
      <div className="bg-white dark:bg-[#1f1f1f] p-6 rounded-lg shadow-sm">
        <div className="flex flex-col md:flex-row gap-4 mb-6 justify-between items-center">
          <ProductFilters />
          <div>
            <Link href="/admin/product/new" className="btn-primary">
              Publicar Nuevo Producto
            </Link>
          </div>
        </div>

        <TableProductAdmin products={products} />
        <div className="mt-6">
          <Pagination totalPages={totalPages} />
        </div>
      </div>
    </div>
  );
}
