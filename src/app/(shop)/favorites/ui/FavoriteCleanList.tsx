'use client';
import React from 'react';
import { IoTrashOutline } from 'react-icons/io5';
import { useFavoriteStore } from '@/store';

export default function FavoriteCleanList() {
  const favorites = useFavoriteStore((state) => state.favorites);
  const clearFavorites = useFavoriteStore((state) => state.clearFavorites);
  return (
    <>
      {favorites.length > 0 && (
        <button
          onClick={clearFavorites}
          className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg shadow-sm hover:bg-red-600 transition-colors"
        >
          <IoTrashOutline className="w-5 h-5" />
          Limpiar lista
        </button>
      )}
    </>
  );
}
