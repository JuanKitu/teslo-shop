'use client';

import React, { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { getTableStyles, TABLE_HEADERS } from './tableStyles';
import ProductRow from './ProductRow';
import type { TableProductAdminProps } from './table.interface';

export default function TableProductAdmin({ products }: TableProductAdminProps) {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Skeleton loader mientras carga el tema
  if (!mounted) {
    const styles = getTableStyles(false);
    return (
      <div className="overflow-x-auto">
        <div className={styles.skeleton} />
      </div>
    );
  }

  const isDark = theme === 'dark';
  const styles = getTableStyles(isDark);

  // Estado vacío
  if (!products || products.length === 0) {
    return (
      <div className={styles.emptyState}>
        <p className="text-lg">No hay productos disponibles</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className={styles.table}>
        <caption className="sr-only">Lista de productos para administración</caption>

        {/* Header */}
        <thead className={styles.thead}>
          <tr>
            {TABLE_HEADERS.map((header) => (
              <th key={header} scope="col" className="text-sm font-medium px-6 py-4 text-left">
                {header}
              </th>
            ))}
          </tr>
        </thead>

        {/* Body */}
        <tbody>
          {products.map((product) => (
            <ProductRow key={product.id} product={product} isDark={isDark} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
