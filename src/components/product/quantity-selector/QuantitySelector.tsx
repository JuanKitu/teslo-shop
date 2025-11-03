'use client';
import React from 'react';
import { IoAddCircleOutline, IoRemoveCircleOutline } from 'react-icons/io5';

interface Props {
  quantity: number; // cantidad actual
  maxStock: number; // stock máximo disponible
  onQuantityChanged: (newQty: number) => void; // callback al cambiar
}

export function QuantitySelector({ quantity, maxStock, onQuantityChanged }: Props) {
  const changeQuantity = (delta: number) => {
    let newQty = quantity + delta;
    if (newQty < 1) newQty = 1;
    if (newQty > maxStock) newQty = maxStock;
    onQuantityChanged(newQty);
  };

  return (
    <div className="flex items-center my-3">
      <button onClick={() => changeQuantity(-1)}>
        <IoRemoveCircleOutline size={30} />
      </button>
      <span className="w-16 text-center mx-2">{quantity}</span>
      <button onClick={() => changeQuantity(1)}>
        <IoAddCircleOutline size={30} />
      </button>
    </div>
  );
}
