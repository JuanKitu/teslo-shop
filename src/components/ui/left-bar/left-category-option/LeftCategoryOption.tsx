'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import clsx from 'clsx';

interface Category {
  id: string;
  name: string;
  slug: string;
  subcategories?: Array<{
    id: string;
    name: string;
    slug: string;
  }>;
}

interface Props {
  categories: Category[];
}

export function LeftCategoryOption({ categories }: Props) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Detectar categoría activa
  const getActiveCategory = () => {
    const match = pathname.match(/\/category\/([^\/]+)/);
    return match ? match[1] : null;
  };

  const activeCategory = getActiveCategory();
  const activeSubcategory = searchParams.get('subcategory');
  const isHome = pathname === '/';

  return (
    <div>
      <h3 className="font-semibold text-base mb-4 text-gray-900 dark:text-white">Categorías</h3>
      <ul className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
        {/* Todos los productos */}
        <li>
          <Link
            className={clsx(
              'hover:text-primary dark:hover:text-white transition-colors',
              isHome && !activeSubcategory && 'font-semibold text-primary dark:text-white'
            )}
            href="/"
          >
            Todos los productos
          </Link>
        </li>

        {/* Categorías dinámicas */}
        {categories.map((category) => (
          <React.Fragment key={category.id}>
            <li>
              <Link
                className={clsx(
                  'hover:text-primary dark:hover:text-white transition-colors',
                  activeCategory === category.slug &&
                    !activeSubcategory &&
                    'font-semibold text-primary dark:text-white'
                )}
                href={`/category/${category.slug}`}
              >
                {category.name}
              </Link>
            </li>

            {/* Subcategorías (mostrar solo si la categoría está activa) */}
            {category.subcategories &&
              activeCategory === category.slug &&
              category.subcategories.map((subcategory) => (
                <li key={subcategory.id} className="pl-4">
                  <Link
                    className={clsx(
                      'hover:text-primary dark:hover:text-white transition-colors text-xs',
                      activeSubcategory === subcategory.slug &&
                        'font-semibold text-primary dark:text-white'
                    )}
                    href={`/category/${category.slug}?subcategory=${subcategory.slug}`}
                  >
                    {subcategory.name}
                  </Link>
                </li>
              ))}
          </React.Fragment>
        ))}
      </ul>
    </div>
  );
}
