import type { CartProduct } from '@/interfaces';
import { StateCreator, create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CartState {
  cart: CartProduct[];
}
interface PropsUpdateVariant {
  slug: string;
  newQuantity: number;
  size?: string;
  color?: string;
}
interface Actions {
  addProductToCart: (product: CartProduct) => void;
  getTotalItems: () => number;
  updateProductQuantity: (product: CartProduct, quantity: number) => void;
  updateProductQuantityBySlug: (slug: string, newQuantity: number) => void;
  updateProductQuantityByVariant: (variant: PropsUpdateVariant) => void;
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
    const updatedCart = cart.filter((item) => item.id !== product.id || item.size !== product.size);
    set({ cart: updatedCart });
  },
  updateProductQuantity: (product, quantity) => {
    const { cart } = get();
    const updatedCart = cart.map((item) => {
      if (item.id === product.id && item.size === product.size) {
        return { ...item, quantity };
      }
      return item;
    });
    set({ cart: updatedCart });
  },
  updateProductQuantityBySlug: (slug, newQuantity) => {
    const { cart } = get();
    const updatedCart = cart.map((item) =>
      item.slug === slug ? { ...item, quantity: newQuantity } : item
    );
    set({ cart: updatedCart });
  },
  updateProductQuantityByVariant: (variant) => {
    const { cart } = get();
    const updatedCart = cart.map((item) => {
      const matchSlug = item.slug === variant.slug;
      const matchSize = variant.size ? item.size === variant.size : true;
      const matchColor = variant.color ? item.color === variant.color : true;

      return matchSlug && matchSize && matchColor
        ? { ...item, quantity: Math.min(variant.newQuantity, item.inStock) }
        : item;
    });
    set({ cart: updatedCart });
  },
  getTotalItems: () => {
    const { cart } = get();
    return cart.reduce((total, item) => total + item.quantity, 0);
  },
  addProductToCart: (product: CartProduct) => {
    const { cart } = get();
    const productInCart = cart.some((item) => item.id === product.id && item.size === product.size);
    if (!productInCart) {
      set({ cart: [...cart, product] });
      return;
    }
    const updatedCart = cart.map((item) => {
      if (item.id === product.id && item.size === product.size) {
        return { ...item, quantity: item.quantity + product.quantity };
      }
      return item;
    });
    set({ cart: updatedCart });
  },
});

export const useCartStore = create<CartStore>()(persist(storeAPI, { name: 'shopping-cart' }));
