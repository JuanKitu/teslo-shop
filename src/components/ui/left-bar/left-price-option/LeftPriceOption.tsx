'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

interface Props {
  min: number;
  max: number;
}

export function LeftPriceOption({ min, max }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [priceValue, setPriceValue] = useState(Number(searchParams.get('maxPrice')) || max);

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    setPriceValue(value);
  };

  const handlePriceCommit = () => {
    const params = new URLSearchParams(searchParams.toString());

    if (priceValue === max) {
      params.delete('maxPrice');
    } else {
      params.set('maxPrice', priceValue.toString());
    }

    router.push(`?${params.toString()}`);
  };

  return (
    <div>
      <h3 className="font-semibold text-base mb-4 text-gray-900 dark:text-white">
        Rango de precio
      </h3>
      <div className="relative pt-1">
        <input
          className="w-full h-1 bg-gray-200 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer"
          max={max}
          min={min}
          type="range"
          value={priceValue}
          onChange={handlePriceChange}
          onMouseUp={handlePriceCommit}
          onTouchEnd={handlePriceCommit}
        />
      </div>
      <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400 mt-2">
        <span>${min}</span>
        <span className="font-semibold text-primary">${priceValue}</span>
        <span>${max}+</span>
      </div>
    </div>
  );
}
