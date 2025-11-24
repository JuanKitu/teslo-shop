'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

interface Props {
  colors: string[];
}

export function LeftColorOption({ colors }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedColor, setSelectedColor] = useState(searchParams.get('color') || '');

  const handleColorChange = (color: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (selectedColor === color) {
      params.delete('color');
      setSelectedColor('');
    } else {
      params.set('color', color);
      setSelectedColor(color);
    }

    router.push(`?${params.toString()}`);
  };

  return (
    <div>
      <h3 className="font-semibold text-base mb-4 text-gray-900 dark:text-white">Color</h3>
      <div className="flex flex-wrap gap-3">
        {colors.map((color) => (
          <button
            key={color}
            aria-label={color}
            onClick={() => handleColorChange(color)}
            className={`w-7 h-7 rounded-full border border-gray-300 dark:border-gray-600 ${
              selectedColor === color
                ? 'ring-2 ring-offset-2 ring-offset-background-light dark:ring-offset-background-dark ring-primary'
                : ''
            }`}
            style={{ backgroundColor: color }}
          />
        ))}
      </div>
    </div>
  );
}
