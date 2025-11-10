'use client';
import React from 'react';
import { useFavoriteStore } from '@/store';
import { ProductGrid } from '@/components';

export default function FavoriteList() {
  const favorites = useFavoriteStore((state) => state.favorites);

  return (
    <>
      {favorites.length === 0 ? (
        <p className="text-center text-gray-500 mt-20 text-lg">Todavía no agregaste favoritos.</p>
      ) : (
        <ProductGrid products={favorites} />
      )}
    </>
  );
}
