import React from 'react';
import { Title, TabsNavigation } from '@/components';
import { AttributesClient } from './ui/AttributesClient';
import { getAllVariantOptions } from '@/actions';

export const revalidate = 0;

const tabs = [
  { name: 'Productos', href: '/admin/products' },
  { name: 'Categorías', href: '/admin/categories' },
  { name: 'Atributos', href: '/admin/attributes' },
];

export default async function AttributesAdminPage() {
  const variantOptions = await getAllVariantOptions();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Title title="Atributos" />
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Crea y gestiona los atributos para las variantes de tus productos.
        </p>
      </div>

      {/* Tabs Navigation */}
      <TabsNavigation tabs={tabs} />

      {/* Content */}
      <AttributesClient initialOptions={variantOptions} />
    </div>
  );
}
