import { useEffect, useRef, useState } from 'react';
import { useCartStore } from '@/store';
import { validateCartStock } from '@/actions';

export interface StockWarning {
  slug: string;
  color?: string;
  size?: string;
  message: string;
  type?: 'warning' | 'error';
}

interface Props {
  delayWindow: number;
  refresh?: number;
}

export function useCartStockValidation({ delayWindow, refresh }: Props) {
  const updateProductQuantityByVariant = useCartStore(
    (state) => state.updateProductQuantityByVariant
  );
  const removeProductFromCart = useCartStore((state) => state.removeProductFromCart);
  const [warnings, setWarnings] = useState<StockWarning[]>([]);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(async () => {
      const currentCart = useCartStore.getState().cart;
      if (currentCart.length === 0) return;

      const result = await validateCartStock(
        currentCart.map((item) => ({
          slug: item.slug,
          quantity: item.quantity,
          color: item.color,
          size: item.size,
        }))
      );

      const adjusted = result.adjustedItems ?? [];

      if (!result.ok && adjusted.length > 0) {
        const newWarnings: StockWarning[] = [];

        adjusted.forEach((item) => {
          // identificador único por variante
          //const id = `${item.slug}-${item.color ?? ""}-${item.size ?? ""}`;

          if (item.newQuantity === 0) {
            const productToRemove = currentCart.find(
              (p) => p.slug === item.slug && p.color === item.color && p.size === item.size
            );
            if (productToRemove) removeProductFromCart(productToRemove);

            newWarnings.push({
              slug: item.slug,
              color: item.color,
              size: item.size,
              message: `El producto "${item.title}" ya no tiene stock disponible.`,
              type: 'error',
            });
          } else {
            updateProductQuantityByVariant({
              slug: item.slug,
              color: item.color,
              size: item.size,
              newQuantity: item.newQuantity,
            });

            newWarnings.push({
              slug: item.slug,
              color: item.color,
              size: item.size,
              message: `Solo quedan ${item.newQuantity} unidades`,
              type: 'warning',
            });
          }
        });

        // merge: reemplaza warnings existentes de la misma variante
        setWarnings((prev) => {
          const filtered = prev.filter(
            (w) =>
              !newWarnings.some(
                (nw) => nw.slug === w.slug && nw.color === w.color && nw.size === w.size
              )
          );
          return [...filtered, ...newWarnings];
        });
      }
    }, delayWindow);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [delayWindow, refresh]);

  // limpiar warnings cuando desaparece la variante del carrito
  useEffect(() => {
    const unsubscribe = useCartStore.subscribe((state) => {
      const cart = state.cart;
      setWarnings((prev) =>
        prev.filter((w) =>
          cart.some(
            (item) =>
              item.slug === w.slug &&
              item.color === w.color &&
              item.size === w.size &&
              item.quantity > 0
          )
        )
      );
    });
    return () => unsubscribe();
  }, []);

  return { warnings, setWarnings };
}
