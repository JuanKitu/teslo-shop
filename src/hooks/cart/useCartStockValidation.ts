// hooks/useCartStockValidation.ts

import { useEffect, useRef, useState } from 'react';
import { useCartStore } from '@/store';
import { validateCartStock } from '@/actions';

export interface StockWarning {
  variantId: string; // 🆕 Usar variantId en lugar de slug+color+size
  title: string;
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
  const updateProductQuantityByVariantId = useCartStore(
    (state) => state.updateProductQuantityByVariantId // ✅ Nombre actualizado
  );
  const removeProductFromCart = useCartStore((state) => state.removeProductFromCart);
  const [warnings, setWarnings] = useState<StockWarning[]>([]);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(async () => {
      const currentCart = useCartStore.getState().cart;
      if (currentCart.length === 0) {
        setWarnings([]);
        return;
      }

      // ✅ Llamar a validateCartStock con el formato correcto
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
          // ✅ Buscar en el carrito por slug+color+size para obtener variantId
          const cartItem = currentCart.find(
            (p) => p.slug === item.slug && p.color === item.color && p.size === item.size
          );

          if (!cartItem) return; // No debería pasar, pero por seguridad

          if (item.newQuantity === 0) {
            // ❌ Sin stock - eliminar del carrito
            removeProductFromCart(cartItem);

            newWarnings.push({
              variantId: cartItem.variantId,
              title: item.title,
              color: item.color,
              size: item.size,
              message: `"${item.title}" (${item.color}, ${item.size}) ya no tiene stock disponible`,
              type: 'error',
            });
          } else {
            // ⚠️ Stock bajo - actualizar cantidad
            updateProductQuantityByVariantId(cartItem.variantId, item.newQuantity);

            newWarnings.push({
              variantId: cartItem.variantId,
              title: item.title,
              color: item.color,
              size: item.size,
              message: `"${item.title}" (${item.color}, ${item.size}): Solo quedan ${item.newQuantity} unidades`,
              type: 'warning',
            });
          }
        });

        // ✅ Merge: reemplaza warnings existentes de la misma variante
        setWarnings((prev) => {
          const filtered = prev.filter(
            (w) => !newWarnings.some((nw) => nw.variantId === w.variantId)
          );
          return [...filtered, ...newWarnings];
        });
      } else {
        // Todo OK - limpiar warnings
        setWarnings([]);
      }
    }, delayWindow);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [delayWindow, refresh]);

  // ✅ Limpiar warnings cuando desaparece la variante del carrito
  useEffect(() => {
    const unsubscribe = useCartStore.subscribe((state) => {
      const cart = state.cart;
      const currentVariantIds = new Set(cart.map((item) => item.variantId));

      setWarnings((prev) => prev.filter((w) => currentVariantIds.has(w.variantId)));
    });
    return () => unsubscribe();
  }, []);

  const clearWarning = (variantId: string) => {
    setWarnings((prev) => prev.filter((w) => w.variantId !== variantId));
  };

  const clearAllWarnings = () => {
    setWarnings([]);
  };

  return {
    warnings,
    setWarnings,
    clearWarning, // 🆕 Helper para limpiar un warning específico
    clearAllWarnings, // 🆕 Helper para limpiar todos
  };
}
