'use client';

import React, { useEffect, useRef, useState, useTransition } from 'react';
import { ProductGrid } from '@/components';
import { Product } from '@/interfaces';
import { loadMoreProducts } from '@/actions';
import { Gender } from '@prisma/client';

interface Props {
  initialProducts: Product[];
  totalPages: number;
  gender?: Gender;
}

export function InfiniteProductGrid({ initialProducts, totalPages, gender }: Props) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [page, setPage] = useState(1);
  const [isPending, startTransition] = useTransition();
  const loaderRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (first.isIntersecting && !isPending && page < totalPages) {
          startTransition(async () => {
            const nextPage = page + 1;
            const newProducts = await loadMoreProducts(nextPage, gender);
            setProducts((prev) => [...prev, ...newProducts]);
            setPage(nextPage);
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
  }, [page, totalPages, isPending, gender]);

  return (
    <div>
      <ProductGrid products={products} />
      <div ref={loaderRef} className="flex justify-center py-8">
        {isPending ? (
          <p className="text-gray-500 animate-pulse">Cargando más productos...</p>
        ) : page >= totalPages ? (
          <p className="text-gray-400">No hay más productos.</p>
        ) : null}
      </div>
    </div>
  );
}
