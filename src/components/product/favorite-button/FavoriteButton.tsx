'use client';
import { useFavoriteStore } from '@/store';
import { Product } from '@/interfaces';
import React from 'react';
import { IoHeart, IoHeartOutline } from 'react-icons/io5';

interface Props {
  product: Product;
}

export function FavoriteButton({ product }: Props) {
  const { toggleFavorite, isFavorite } = useFavoriteStore();
  const active = isFavorite(product.id);

  return (
    <button
      onClick={() => toggleFavorite(product)}
      className="transition-transform duration-200 hover:scale-110 cursor-pointer"
      title={active ? 'Quitar de favoritos' : 'Agregar a favoritos'}
    >
      {active ? (
        <IoHeart className="w-6 h-6 text-red-500 drop-shadow-sm transition-all duration-300" />
      ) : (
        <IoHeartOutline className="w-6 h-6 text-gray-600 hover:text-red-500 transition-all duration-300" />
      )}
    </button>
  );
}
