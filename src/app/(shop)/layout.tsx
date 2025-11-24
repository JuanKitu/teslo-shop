// app/(shop)/layout.tsx
import { Footer, Sidebar, TopMenu } from '@/components';
import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: {
    template: '%s - | Teslo Shop',
    default: 'Home - | Teslo Shop',
  },
  description: 'Una tienda de productos de productos',
};

export default async function ShopLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen">
      <TopMenu />
      <Sidebar />

      {/* Solo el contenedor base */}
      <div className="px-5 sm:px-10">{children}</div>

      <Footer />
    </main>
  );
}
