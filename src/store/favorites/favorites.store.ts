'use client';
import { StateCreator, create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product } from '@/interfaces';
import { addFavorite, removeFavorite } from '@/actions';

interface FavoriteState {
  favorites: Product[];
}
interface Actions {
  toggleFavorite: (product: Product, userId?: string) => void;
  isFavorite: (id: string) => boolean;
  clearFavorites: () => void;
  setFavorites: (products: Product[]) => void;
}

type FavoriteStore = FavoriteState & Actions;

const storeAPI: StateCreator<FavoriteStore> = (set, get) => ({
  favorites: [],

  toggleFavorite: async (product, userId) => {
    const isFav = get().favorites.some((p) => p.id === product.id);
    if (isFav) {
      set({
        favorites: get().favorites.filter((p) => p.id !== product.id),
      });
      // sincroniza en background si está logueado
      if (userId) removeFavorite(product.id).catch(() => {});
    } else {
      set({ favorites: [...get().favorites, product] });
      if (userId) addFavorite(product.id).catch(() => {});
    }
  },

  isFavorite: (id) => get().favorites.some((p) => p.id === id),

  clearFavorites: () => set({ favorites: [] }),
  // sincroniza cuando se loguea
  setFavorites: (products) => set({ favorites: products }),
});
export const useFavoriteStore = create<FavoriteStore>()(persist(storeAPI, { name: 'favorites' }));
