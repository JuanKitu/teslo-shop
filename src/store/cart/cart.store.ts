import type {CartProduct} from "@/interfaces";
import {StateCreator, create} from "zustand";
import {persist} from "zustand/middleware";

interface CartState {
    cart: CartProduct[]
}

interface Actions {
    addProductToCart: (product: CartProduct) => void;
    getTotalItems: () => number;
    updateProductQuantity: (product: CartProduct, quantity: number) => void;
    removeProductFromCart: (product: CartProduct) => void;
    getSummaryInformation: () => {
        subtotal: number;
        tax: number;
        total: number;
        itemsInCart: number;
    };
    cleatCart: () => void;
}

type CartStore = CartState & Actions;
const storeAPI: StateCreator<CartStore> = (set, get) => ({
    cart: [],
    cleatCart: () => {
        set({cart: []});
    },
    getSummaryInformation: () => {
        const {cart} = get();
        const subtotal = cart.reduce((total, item) => total + item.quantity * item.price, 0);
        const tax = subtotal * 0.16;
        const total = subtotal + tax;
        const itemsInCart = cart.reduce((total, item) => total + item.quantity, 0);
        return {
            subtotal,
            tax,
            total,
            itemsInCart,
        }
    },
    removeProductFromCart: (product) => {
        const {cart} = get();
        const updatedCart = cart.filter((item) => (
            item.id !== product.id || item.size !== product.size
        ));
        set({cart: updatedCart});
    },
    updateProductQuantity: (product, quantity) => {
        const {cart} = get();
        const updatedCart = cart.map((item) => {
            if (item.id === product.id && item.size === product.size) {
                return {...item, quantity};
            }
            return item;
        });
        set({cart: updatedCart});
    },
    getTotalItems: () => {
        const {cart} = get();
        return cart.reduce((total, item) => total + item.quantity, 0);
    },
    addProductToCart: (product: CartProduct) => {
        const {cart} = get();
        const productInCart = cart.some((item) => (
            item.id === product.id && item.size === product.size
        ));
        if (!productInCart) {
            set({cart: [...cart, product]});
            return;
        }
        const updatedCart = cart.map((item) => {
            if (item.id === product.id && item.size === product.size) {
                return {...item, quantity: item.quantity + product.quantity};
            }
            return item;
        });
        set({cart: updatedCart});
    }
})

export const useCartStore = create<CartStore>()(
    persist(
        storeAPI,
        {name: 'shopping-cart'}
    )
)