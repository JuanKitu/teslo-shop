'use client';

import React, { useEffect, useRef, useState, useTransition } from 'react';
import { ProductGrid } from '@/components';
import type { Product } from '@/interfaces';
import { loadMoreProducts } from '@/actions';

interface Props {
  initialProducts: Product[];
  totalPages: number;
  categorySlug?: string;
  subcategorySlug?: string; // ← NUEVO
  brandSlug?: string;
  searchParams?: {
    subcategory?: string; // ← NUEVO
    color?: string;
    size?: string;
    brand?: string;
    brands?: string;
    maxPrice?: string;
  };
}

export function InfiniteProductGrid({
  initialProducts,
  totalPages,
  categorySlug,
  subcategorySlug,
  brandSlug,
  searchParams = {},
}: Props) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [page, setPage] = useState(1);
  const [currentTotalPages, setCurrentTotalPages] = useState(totalPages);
  const [isPending, startTransition] = useTransition();
  const loaderRef = useRef<HTMLDivElement | null>(null);

  // 🔄 Resetear cuando cambien los filtros
  useEffect(() => {
    setProducts(initialProducts);
    setPage(1);
    setCurrentTotalPages(totalPages);
  }, [
    initialProducts,
    totalPages,
    categorySlug,
    subcategorySlug,
    brandSlug,
    searchParams.subcategory, // ← NUEVO
    searchParams.color,
    searchParams.size,
    searchParams.brand,
    searchParams.brands,
    searchParams.maxPrice,
  ]);

  // 📜 Infinite scroll observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (first.isIntersecting && !isPending && page < currentTotalPages) {
          startTransition(async () => {
            const nextPage = page + 1;

            const newProducts = await loadMoreProducts({
              page: nextPage,
              categorySlug,
              subcategorySlug: searchParams.subcategory, // ← NUEVO
              brandSlug,
              color: searchParams.color,
              size: searchParams.size,
              brand: searchParams.brand || searchParams.brands,
              maxPrice: searchParams.maxPrice ? Number(searchParams.maxPrice) : undefined,
            });

            if (newProducts && newProducts.length > 0) {
              setProducts((prev) => [...prev, ...newProducts]);
              setPage(nextPage);
            }
          });
        }
      },
      { threshold: 0.5 }
    );

    const current = loaderRef.current;
    if (current) observer.observe(current);

    return () => {
      if (current) observer.unobserve(current);
    };
  }, [
    page,
    currentTotalPages,
    isPending,
    categorySlug,
    subcategorySlug,
    brandSlug,
    searchParams.subcategory, // ← NUEVO
    searchParams.color,
    searchParams.size,
    searchParams.brand,
    searchParams.brands,
    searchParams.maxPrice,
  ]);

  return (
    <div>
      <ProductGrid products={products} />

      {/* Loader */}
      <div ref={loaderRef} className="flex justify-center py-8 min-h-[100px]">
        {isPending ? (
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            <p className="text-gray-500 dark:text-gray-400">Cargando más productos...</p>
          </div>
        ) : page >= currentTotalPages ? (
          products.length > 0 ? (
            <p className="text-gray-400 dark:text-gray-500">No hay más productos.</p>
          ) : null
        ) : null}
      </div>
    </div>
  );
}
