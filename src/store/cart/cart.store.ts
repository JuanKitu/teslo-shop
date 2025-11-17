import type { CartProduct } from '@/interfaces';
import { StateCreator, create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CartState {
  cart: CartProduct[];
}
interface Actions {
  addProductToCart: (product: CartProduct) => void;
  getTotalItems: () => number;
  updateProductQuantity: (product: CartProduct, quantity: number) => void;
  updateProductQuantityByVariantId: (variantId: string, newQuantity: number) => void; // 🆕
  removeProductFromCart: (product: CartProduct) => void;
  getSummaryInformation: () => {
    subtotal: number;
    tax: number;
    total: number;
    itemsInCart: number;
  };
  clearCart: () => void;
}

type CartStore = CartState & Actions;

const storeAPI: StateCreator<CartStore> = (set, get) => ({
  cart: [],

  clearCart: () => {
    set({ cart: [] });
  },

  getSummaryInformation: () => {
    const { cart } = get();
    const subtotal = cart.reduce((total, item) => total + item.quantity * item.price, 0);
    const tax = subtotal * 0.15;
    const total = subtotal + tax;
    const itemsInCart = cart.reduce((total, item) => total + item.quantity, 0);
    return {
      subtotal,
      tax,
      total,
      itemsInCart,
    };
  },

  removeProductFromCart: (product) => {
    const { cart } = get();
    // 🆕 Comparar por variantId
    const updatedCart = cart.filter((item) => item.variantId !== product.variantId);
    set({ cart: updatedCart });
  },

  updateProductQuantity: (product, quantity) => {
    const { cart } = get();
    const updatedCart = cart.map((item) => {
      // 🆕 Comparar por variantId
      if (item.variantId === product.variantId) {
        return { ...item, quantity: Math.min(quantity, item.inStock) };
      }
      return item;
    });
    set({ cart: updatedCart });
  },

  // 🆕 Nueva función más simple
  updateProductQuantityByVariantId: (variantId, newQuantity) => {
    const { cart } = get();
    const updatedCart = cart.map((item) =>
      item.variantId === variantId
        ? { ...item, quantity: Math.min(newQuantity, item.inStock) }
        : item
    );
    set({ cart: updatedCart });
  },

  getTotalItems: () => {
    const { cart } = get();
    return cart.reduce((total, item) => total + item.quantity, 0);
  },

  addProductToCart: (product: CartProduct) => {
    const { cart } = get();

    // 🆕 Buscar por variantId
    const existingItem = cart.find((item) => item.variantId === product.variantId);

    if (!existingItem) {
      set({ cart: [...cart, product] });
      return;
    }

    // Si ya existe, incrementar cantidad (respetando stock)
    const updatedCart = cart.map((item) => {
      if (item.variantId === product.variantId) {
        const newQuantity = item.quantity + product.quantity;
        return {
          ...item,
          quantity: Math.min(newQuantity, item.inStock),
        };
      }
      return item;
    });

    set({ cart: updatedCart });
  },
});

export const useCartStore = create<CartStore>()(persist(storeAPI, { name: 'shopping-cart' }));
