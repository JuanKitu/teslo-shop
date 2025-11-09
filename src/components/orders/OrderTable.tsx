'use client';

import React, { useEffect, useState } from 'react';
import { OrdersListInterface } from '@/interfaces';
import { IoCardOutline } from 'react-icons/io5';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import clsx from 'clsx';

interface Props {
  orders: OrdersListInterface[];
}

export function OrderTable({ orders }: Props) {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = theme === 'dark';

  if (!mounted) return null; // Evita renderizado hasta que se cargue el theme

  return (
    <table
      className={clsx(
        'min-w-full rounded-lg overflow-hidden shadow',
        isDark ? 'bg-[var(--color-card)] text-[var(--color-text)]' : 'bg-white text-gray-900'
      )}
    >
      <thead
        className={clsx(
          'border-b',
          isDark
            ? 'bg-[var(--color-border)] border-[var(--color-border)]'
            : 'bg-gray-200 border-gray-300'
        )}
      >
        <tr>
          <th className="text-sm font-medium px-6 py-4 text-left">#ID</th>
          <th className="text-sm font-medium px-6 py-4 text-left">Nombre completo</th>
          <th className="text-sm font-medium px-6 py-4 text-left">Estado</th>
          <th className="text-sm font-medium px-6 py-4 text-left">Opciones</th>
        </tr>
      </thead>
      <tbody>
        {orders.map((order) => (
          <tr
            key={order.id}
            className={clsx(
              'border-b transition duration-300 ease-in-out',
              isDark
                ? 'border-[var(--color-border)] hover:bg-[rgba(255,255,255,0.1)]'
                : 'bg-white border-gray-300 hover:bg-gray-100'
            )}
          >
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
              {order.id.split('-').at(-1)}
            </td>
            <td className="text-sm font-light px-6 py-4 whitespace-nowrap">
              {order.OrderAddress?.firstName} {order.OrderAddress?.lastName}
            </td>
            <td className="flex items-center text-sm font-light px-6 py-4 whitespace-nowrap">
              {order.isPaid ? (
                <>
                  <IoCardOutline className="text-green-500" />
                  <span className="mx-2 text-green-500">Pagada</span>
                </>
              ) : (
                <>
                  <IoCardOutline className="text-red-500" />
                  <span className="mx-2 text-red-500">No Pagada</span>
                </>
              )}
            </td>
            <td className="text-sm font-light px-6 py-4">
              <Link
                href={`/orders/${order.id}`}
                className={clsx('hover:underline', isDark ? 'text-blue-400' : 'text-blue-600')}
              >
                Ver orden
              </Link>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
