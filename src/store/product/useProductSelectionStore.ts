import { create } from 'zustand';
import { StateCreator } from 'zustand';
import { ProductVariant } from '@/interfaces';

interface ProductSelectionState {
  selectedVariant?: ProductVariant;
  quantity: number;
}

interface Actions {
  setVariant: (variant?: ProductVariant) => void;
  setQuantity: (quantity: number) => void;
  reset: () => void;
}

type ProductSelectionStore = ProductSelectionState & Actions;

const storeAPI: StateCreator<ProductSelectionStore> = (set) => ({
  selectedVariant: undefined,
  quantity: 1,

  setVariant: (variant) =>
    set((state) => ({
      selectedVariant: variant,
      quantity: variant ? Math.min(state.quantity, variant.stock) : 1,
    })),
  setQuantity: (quantity) => set({ quantity }),
  reset: () => set({ selectedVariant: undefined }),
});

export const useProductSelectionStore = create<ProductSelectionStore>()(storeAPI);
