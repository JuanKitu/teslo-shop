'use client';
import React, { useState } from 'react';
import { SizeSelector, QuantitySelector, StockLabel, ColorSelector } from '@/components';
import type { Product } from '@/interfaces';
import { useCartStore, useProductSelectionStore } from '@/store';
import { addToCartWithStockValidation } from '@/actions';

interface Props {
  product: Product;
  onStockError?: () => void;
}

export function AddToCart({ product, onStockError }: Props) {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const addProductToCart = useCartStore((state) => state.addProductToCart);
  const selectedVariant = useProductSelectionStore((state) => state.selectedVariant);
  const quantity = useProductSelectionStore((state) => state.quantity);
  const setVariant = useProductSelectionStore((state) => state.setVariant);
  const setQuantity = useProductSelectionStore((state) => state.setQuantity);

  const addToCart = async () => {
    // ✅ Validar que haya variante seleccionada
    if (!selectedVariant) {
      setError('Debes seleccionar color y talla');
      return;
    }

    // ✅ Validar que tenga color y size
    if (!selectedVariant.color || !selectedVariant.size) {
      setError('La variante seleccionada no es válida');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await addToCartWithStockValidation({
        slug: product.slug,
        color: selectedVariant.color,
        size: selectedVariant.size,
        quantity,
      });

      if (!res.ok) {
        setError(res.message);
        if (res.variant) setVariant(res.variant);
        onStockError?.();
        return;
      }

      // ✅ Agregar al carrito con variantId
      addProductToCart({
        id: product.id,
        variantId: selectedVariant.id, // 🆕 ID de la variante
        slug: product.slug,
        image: selectedVariant.images[0] ?? product.images[0] ?? '/imgs/placeholder.jpg',
        title: product.title,
        price: selectedVariant.price ? selectedVariant.price : product.price,
        inStock: selectedVariant.inStock, // ✅ stock → inStock
        size: selectedVariant.size,
        color: selectedVariant.color,
        quantity,
      });

      setQuantity(1);
      setError('');
    } catch (err) {
      console.error('[AddToCart]', err);
      setError('Error al agregar el producto al carrito');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ColorSelector variants={product.variants} />
      <SizeSelector variants={product.variants} />
      <QuantitySelector
        quantity={quantity}
        maxStock={selectedVariant?.inStock ?? 0} // ✅ stock → inStock
        onQuantityChanged={setQuantity}
      />
      <StockLabel />

      {error && <p className="text-red-500 my-2 text-sm">{error}</p>}

      <button
        className="btn-primary my-3 disabled:opacity-50 disabled:cursor-not-allowed"
        onClick={addToCart}
        disabled={loading || !selectedVariant || (selectedVariant?.inStock ?? 0) === 0}
      >
        {loading ? 'Agregando...' : 'Agregar al carrito'}
      </button>
    </>
  );
}
