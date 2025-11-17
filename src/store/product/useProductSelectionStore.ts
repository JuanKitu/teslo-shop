import { create } from 'zustand';
import type { StateCreator } from 'zustand';
import type { ProductVariant } from '@/interfaces';

interface ProductSelectionState {
  selectedVariant?: ProductVariant;
  quantity: number;
}

interface Actions {
  setVariant: (variant?: ProductVariant) => void;
  setQuantity: (quantity: number) => void;
  incrementQuantity: () => void;
  decrementQuantity: () => void;
  reset: () => void;
}

type ProductSelectionStore = ProductSelectionState & Actions;

const storeAPI: StateCreator<ProductSelectionStore> = (set) => ({
  selectedVariant: undefined,
  quantity: 1,

  setVariant: (variant) =>
    set((state) => ({
      selectedVariant: variant,
      // ✅ stock → inStock
      quantity: variant ? Math.min(state.quantity, variant.inStock) : 1,
    })),

  setQuantity: (quantity) =>
    set((state) => {
      const { selectedVariant } = state;

      // Validar que no exceda el stock disponible
      if (selectedVariant) {
        const maxQuantity = selectedVariant.inStock; // ✅ stock → inStock
        return { quantity: Math.min(Math.max(1, quantity), maxQuantity) };
      }

      return { quantity: Math.max(1, quantity) };
    }),

  incrementQuantity: () =>
    set((state) => {
      const { selectedVariant, quantity } = state;

      if (selectedVariant && quantity < selectedVariant.inStock) {
        // ✅ stock → inStock
        return { quantity: quantity + 1 };
      }

      return state;
    }),

  decrementQuantity: () =>
    set((state) => {
      const { quantity } = state;

      if (quantity > 1) {
        return { quantity: quantity - 1 };
      }

      return state;
    }),

  reset: () => set({ selectedVariant: undefined, quantity: 1 }), // ✅ Reset también quantity
});

export const useProductSelectionStore = create<ProductSelectionStore>()(storeAPI);
