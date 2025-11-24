'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';

interface Brand {
  id: string;
  name: string;
  slug: string;
}

interface Props {
  brands: Brand[];
  maxVisible?: number;
}

export function LeftBrandOption({ brands, maxVisible = 5 }: Props) {
  const pathname = usePathname();
  const [showAll, setShowAll] = useState(false);
  const displayBrands = showAll ? brands : brands.slice(0, maxVisible);

  // Detectar marca activa desde la URL
  const getActiveBrand = () => {
    const match = pathname.match(/\/brand\/([^\/]+)/);
    return match ? match[1] : null;
  };

  const activeBrand = getActiveBrand();

  return (
    <div>
      <h3 className="font-semibold text-base mb-4 text-gray-900 dark:text-white">Marcas</h3>
      <ul className="space-y-2 text-sm">
        {displayBrands.map((brand) => (
          <li key={brand.id}>
            <Link
              className={clsx(
                'hover:text-primary dark:hover:text-white transition-colors',
                activeBrand === brand.slug
                  ? 'font-semibold text-primary dark:text-white'
                  : 'text-gray-600 dark:text-gray-400'
              )}
              href={`/brand/${brand.slug}`}
            >
              {brand.name}
            </Link>
          </li>
        ))}
      </ul>

      {brands.length > maxVisible && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="text-sm text-primary hover:underline mt-3 font-medium"
        >
          {showAll ? 'Ver menos' : `Ver todas (${brands.length})`}
        </button>
      )}
    </div>
  );
}
