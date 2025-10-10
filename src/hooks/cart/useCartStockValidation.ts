import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { useCartStore } from "@/store";
import { validateCartStock } from "@/actions";

export interface StockWarning {
    slug: string;
    message: string;
}
interface Props {
    delayWindow: number;
    refresh?: number;
}

export function useCartStockValidation({ delayWindow, refresh }: Props) {
    const cart = useCartStore(state => state.cart);
    const updateProductQuantityBySlug = useCartStore(state => state.updateProductQuantityBySlug);
    const [warnings, setWarnings] = useState<StockWarning[]>([]);
    const debounceRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (debounceRef.current) clearTimeout(debounceRef.current);

        debounceRef.current = setTimeout(async () => {
            const result = await validateCartStock(
                cart.map(item => ({ slug: item.slug, quantity: item.quantity }))
            );

            const adjusted = result.adjustedItems ?? [];
            if (!result.ok && adjusted.length > 0) {
                const newWarnings: StockWarning[] = adjusted.map(item => {
                    updateProductQuantityBySlug(item.slug, item.newQuantity);
                    const message = `Solo quedan ${item.newQuantity} unidades`;
                    toast.warning(message);
                    return { slug: item.slug, message };
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
    }, [cart, updateProductQuantityBySlug, delayWindow, refresh]);

    // limpiar warnings si el producto fue eliminado
    useEffect(() => {
        setWarnings(prev =>
            prev.filter(w => cart.some(item => item.slug === w.slug && item.quantity > 0))
        );
    }, [cart]);

    return { warnings, setWarnings };
}
