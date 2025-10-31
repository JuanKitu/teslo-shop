'use client';
import React from 'react';
import { useFavoriteStore } from '@/store';
import { ProductGrid, Title } from '@/components';
import { IoTrashOutline } from 'react-icons/io5';

export default function FavoritesPage() {
  const { favorites, clearFavorites } = useFavoriteStore();

  return (
    <div className="p-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-3">
        <Title title="Mis favoritos" subtitle="Productos que te encantaron" />

        {favorites.length > 0 && (
          <button
            onClick={clearFavorites}
            className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg shadow-sm hover:bg-red-600 transition-colors"
          >
            <IoTrashOutline className="w-5 h-5" />
            Limpiar lista
          </button>
        )}
      </div>

      {favorites.length === 0 ? (
        <p className="text-center text-gray-500 mt-20 text-lg">Todavía no agregaste favoritos.</p>
      ) : (
        <ProductGrid products={favorites} />
      )}
    </div>
  );
}
