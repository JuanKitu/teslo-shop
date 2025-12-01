'use client';

import React, { useState, useMemo } from 'react';
import { fuzzyFilter } from '@/utils/search/fuzzy-search';
import { TabsNavigation, Title } from '@/components';
import { ProductFilters } from './ProductFilters';
import Link from 'next/link';
import TableProductAdmin from './table-admin/TableProductAdmin';
import type { Product } from '@/interfaces';

interface Props {
  products: Product[];
}

const tabs = [
  { name: 'Productos', href: '/admin/products' },
  { name: 'Categorías', href: '/admin/categories' },
  { name: 'Atributos', href: '/admin/attributes' },
];

const ITEMS_PER_PAGE = 12;

export function ProductsAdminClient({ products }: Props) {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [stockFilter, setStockFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // Obtener lista única de categorías
  const categories = useMemo(() => {
    const catSet = new Set<string>();
    products.forEach((p) => {
      p.categories?.forEach((pc) => {
        catSet.add(pc.category.name);
      });
    });
    return Array.from(catSet).sort();
  }, [products]);

  // Filtrar productos con fuzzy search
  const filteredProducts = useMemo(() => {
    let result = products;

    // 1. Búsqueda fuzzy por nombre o SKU
    if (searchTerm.trim()) {
      result = fuzzyFilter(
        result,
        searchTerm,
        (p) => {
          // Buscar en título y SKUs de variantes
          const skus = p.variants.map((v) => v.sku || '').join(' ');
          return `${p.title} ${skus}`;
        },
        50 // threshold más bajo para ser más permisivo
      );
    }

    // 2. Filtrar por categoría
    if (categoryFilter) {
      result = result.filter((p) =>
        p.categories?.some((pc) => pc.category.name === categoryFilter)
      );
    }

    // 3. Filtrar por estado
    if (statusFilter === 'active') {
      result = result.filter((p) => p.isActive !== false);
    } else if (statusFilter === 'inactive') {
      result = result.filter((p) => p.isActive === false);
    }

    // 4. Filtrar por stock
    if (stockFilter) {
      result = result.filter((p) => {
        const totalStock = p.variants.reduce((sum, v) => sum + v.inStock, 0);
        if (stockFilter === 'in-stock') return totalStock > 5;
        if (stockFilter === 'low-stock') return totalStock > 0 && totalStock <= 5;
        if (stockFilter === 'out-of-stock') return totalStock === 0;
        return true;
      });
    }

    // Reset page when filters change
    return result;
  }, [products, searchTerm, categoryFilter, statusFilter, stockFilter]);

  // Calcular paginación del lado del cliente
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;
    return filteredProducts.slice(start, end);
  }, [filteredProducts, currentPage]);

  // Reset page cuando cambian los filtros
  useMemo(() => {
    setCurrentPage(1);
  }, []);

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
          <ProductFilters
            searchTerm={searchTerm}
            categoryFilter={categoryFilter}
            statusFilter={statusFilter}
            stockFilter={stockFilter}
            categories={categories}
            onSearchChange={setSearchTerm}
            onCategoryChange={setCategoryFilter}
            onStatusChange={setStatusFilter}
            onStockChange={setStockFilter}
          />
          <div>
            <Link href="/admin/product/new" className="btn-primary">
              Publicar Nuevo Producto
            </Link>
          </div>
        </div>

        {/* Contador de resultados */}
        <div className="mb-4 flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
          <div>
            {searchTerm || categoryFilter || statusFilter || stockFilter ? (
              <>
                {filteredProducts.length} producto{filteredProducts.length !== 1 ? 's' : ''}{' '}
                encontrado
                {filteredProducts.length !== 1 ? 's' : ''}
                {searchTerm && ` para "${searchTerm}"`}
              </>
            ) : (
              <>
                {products.length} producto{products.length !== 1 ? 's' : ''} en total
              </>
            )}
          </div>
          {totalPages > 1 && (
            <div>
              Página {currentPage} de {totalPages}
            </div>
          )}
        </div>

        <TableProductAdmin products={paginatedProducts} />

        {totalPages > 1 && (
          <div className="mt-6">
            <ClientPagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </div>
    </div>
  );
}

// Componente de paginación del lado del cliente
function ClientPagination({
  currentPage,
  totalPages,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex justify-center gap-2">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-1 rounded border disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-700"
      >
        Anterior
      </button>

      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`px-3 py-1 rounded border ${
            page === currentPage
              ? 'bg-blue-500 text-white border-blue-500'
              : 'hover:bg-gray-100 dark:hover:bg-gray-700'
          }`}
        >
          {page}
        </button>
      ))}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-1 rounded border disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-700"
      >
        Siguiente
      </button>
    </div>
  );
}
