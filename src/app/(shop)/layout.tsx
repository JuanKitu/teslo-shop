import { Footer, Sidebar, TopMenu } from '@/components';
import { Metadata } from 'next';
import { getMainCategories } from '@/actions';
import React from 'react';
export const metadata: Metadata = {
  title: {
    template: '%s - | Teslo Shop',
    default: 'Home - | Teslo Shop',
  },
  description: 'Una tienda de productos de productos',
};
export default async function ShopLayout({ children }: { children: React.ReactNode }) {
  const categories = await getMainCategories(4);
  return (
    <main className="min-h-screen">
      <TopMenu categories={categories} />
      <Sidebar />
      <div className="px-0 sm:px-10">{children}</div>
      <Footer />
    </main>
  );
}
