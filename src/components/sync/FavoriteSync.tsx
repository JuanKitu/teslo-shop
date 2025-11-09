'use client';
import { useSession } from 'next-auth/react';
import { useEffect } from 'react';
import { useFavoriteStore } from '@/store';
import { getUserFavorites } from '@/actions/favorites/get-favorites';
import type { Product } from '@/interfaces';

export function FavoriteSync() {
  const { data: session } = useSession();
  const favorites = useFavoriteStore((state) => state.favorites);
  const setFavorites = useFavoriteStore((state) => state.setFavorites);
  useEffect(() => {
    if (!session?.user?.id) return;

    (async () => {
      try {
        const serverFavorites: Product[] = await getUserFavorites();
        const merged: Product[] = [
          ...serverFavorites.filter((sf) => !favorites.some((f) => f.id === sf.id)),
          ...favorites,
        ];

        setFavorites(merged);
      } catch (err) {
        console.error('Error al sincronizar favoritos', err);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session?.user?.id]);

  return null;
}
