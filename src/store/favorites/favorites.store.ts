import { StateCreator, create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product } from '@/interfaces';

interface FavoriteState {
  favorites: Product[];
}
interface Actions {
  toggleFavorite: (product: Product) => void;
  isFavorite: (id: string) => boolean;
  clearFavorites: () => void;
}
type FavoriteStore = FavoriteState & Actions;
const storeAPI: StateCreator<FavoriteStore> = (set, get) => ({
  favorites: [],

  toggleFavorite: (product) => {
    const isFav = get().favorites.some((p) => p.id === product.id);
    if (isFav) {
      set({
        favorites: get().favorites.filter((p) => p.id !== product.id),
      });
    } else {
      set({ favorites: [...get().favorites, product] });
    }
  },

  isFavorite: (id) => get().favorites.some((p) => p.id === id),

  clearFavorites: () => set({ favorites: [] }),
});
export const useFavoriteStore = create<FavoriteStore>()(persist(storeAPI, { name: 'favorites' }));
