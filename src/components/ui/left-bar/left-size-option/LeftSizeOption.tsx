'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

interface Props {
  sizes: string[];
}

export function LeftSizeOption({ sizes }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedSize, setSelectedSize] = useState(searchParams.get('size') || '');

  const handleSizeChange = (size: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (selectedSize === size) {
      params.delete('size');
      setSelectedSize('');
    } else {
      params.set('size', size);
      setSelectedSize(size);
    }

    router.push(`?${params.toString()}`);
  };

  return (
    <div>
      <h3 className="font-semibold text-base mb-4 text-gray-900 dark:text-white">Talla</h3>
      <div className="flex flex-wrap gap-2">
        {sizes.map((size) => (
          <button
            key={size}
            onClick={() => handleSizeChange(size)}
            className={`px-4 py-2 border rounded-lg text-sm font-medium ${
              selectedSize === size
                ? 'border-primary dark:border-primary bg-gray-100 dark:bg-gray-700 text-primary dark:text-white'
                : 'border-gray-200 dark:border-gray-600 hover:border-primary dark:hover:border-primary'
            }`}
          >
            {size}
          </button>
        ))}
      </div>
    </div>
  );
}
