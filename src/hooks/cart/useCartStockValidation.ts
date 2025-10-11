import { useEffect, useRef, useState } from "react";
import { useCartStore } from "@/store";
import { validateCartStock } from "@/actions";

export interface StockWarning {
    slug: string;
    message: string;
    type?: "warning" | "error";
}

interface Props {
    delayWindow: number;
    refresh?: number;
}

export function useCartStockValidation({ delayWindow, refresh }: Props) {
    const updateProductQuantityBySlug = useCartStore(state => state.updateProductQuantityBySlug);
    const removeProductFromCart = useCartStore(state => state.removeProductFromCart);
    const [warnings, setWarnings] = useState<StockWarning[]>([]);
    const debounceRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (debounceRef.current) clearTimeout(debounceRef.current);

        debounceRef.current = setTimeout(async () => {
            // ✅ Obtenemos el carrito directamente del store actual
            const currentCart = useCartStore.getState().cart;

            if (currentCart.length === 0) return;

            const result = await validateCartStock(
                currentCart.map(item => ({ slug: item.slug, quantity: item.quantity }))
            );

            const adjusted = result.adjustedItems ?? [];

            if (!result.ok && adjusted.length > 0) {
                const newWarnings: StockWarning[] = [];

                adjusted.forEach(item => {
                    if (item.newQuantity === 0) {
                        const productToRemove = currentCart.find(p => p.slug === item.slug);
                        if (productToRemove) removeProductFromCart(productToRemove);
                        const message = `El producto "${item.slug}" ya no tiene stock disponible.`;
                        newWarnings.push({ slug: item.slug, message, type: "error" });
                    } else {
                        updateProductQuantityBySlug(item.slug, item.newQuantity);
                        const message = `Solo quedan ${item.newQuantity} unidades`;
                        newWarnings.push({ slug: item.slug, message, type: "warning" });
                    }
                });

                setWarnings(prev => {
                    const merged = [...prev];
                    newWarnings.forEach(w => {
                        if (!merged.some(x => x.slug === w.slug)) merged.push(w);
                    });
                    return merged;
                });
            }
        }, delayWindow);

        return () => {
            if (debounceRef.current) clearTimeout(debounceRef.current);
        };
        // ✅ Solo depende de refresh y delayWindow
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [delayWindow, refresh]);

    // 🔄 Limpia los warnings cuando el producto desaparece del carrito
    useEffect(() => {
        const unsubscribe = useCartStore.subscribe((state) => {
            const cart = state.cart;
            setWarnings(prev =>
                prev.filter(w =>
                    cart.some(item => item.slug === w.slug && item.quantity > 0)
                )
            );
        });
        return () => unsubscribe();
    }, []);

    return { warnings, setWarnings };
}
