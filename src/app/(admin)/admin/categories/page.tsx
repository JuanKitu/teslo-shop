import React from 'react';
import { Title } from '@/components';
import { getAllCategories } from '@/actions';
import { CategoriesClient } from './ui/CategoriesClient';

export const revalidate = 0;

export default async function CategoriesAdminPage() {
  const categories = await getAllCategories();

  return (
    <>
      <Title title="Gestión de Categorías" />
      <CategoriesClient initialCategories={categories} />
    </>
  );
}
