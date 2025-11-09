'use client';
import { useFavoriteStore } from '@/store';
import { Product } from '@/interfaces';
import { IoHeart, IoHeartOutline } from 'react-icons/io5';
import { useSession } from 'next-auth/react';
import React, { useEffect, useState } from 'react';

interface Props {
  product: Product;
}

export function FavoriteButton({ product }: Props) {
  const toggleFavorite = useFavoriteStore((state) => state.toggleFavorite);
  const isFavorite = useFavoriteStore((state) => state.isFavorite);
  const { data: session } = useSession();

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) {
    // Evita hydration mismatch: renderiza un estado neutral
    return (
      <button
        className="transition-transform duration-200 hover:scale-110 cursor-pointer"
        title="Agregar a favoritos"
        aria-label="Agregar a favoritos"
      >
        <IoHeartOutline className="w-6 h-6 text-gray-600 hover:text-red-500 transition-all duration-300" />
      </button>
    );
  }

  const active = isFavorite(product.id);

  return (
    <button
      onClick={() => toggleFavorite(product, session?.user?.id)}
      className="transition-transform duration-200 hover:scale-110 cursor-pointer"
      title={active ? 'Quitar de favoritos' : 'Agregar a favoritos'}
      aria-label={active ? 'Quitar de favoritos' : 'Agregar a favoritos'}
    >
      {active ? (
        <IoHeart className="w-6 h-6 text-red-500 drop-shadow-sm transition-all duration-300" />
      ) : (
        <IoHeartOutline className="w-6 h-6 text-gray-600 hover:text-red-500 transition-all duration-300" />
      )}
    </button>
  );
}
