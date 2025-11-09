'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { titleFont } from '@/app/config/fonts';
import { IoCartOutline, IoSearchOutline, IoHeartOutline, IoMenuOutline } from 'react-icons/io5';
import { useCartStore, useUiStore, useFavoriteStore } from '@/store';
import { useTheme } from 'next-themes';
import clsx from 'clsx';
const categories = [
  {
    name: 'Hombres',
    url: '/gender/men',
  },
  {
    name: 'Mujeres',
    url: '/gender/women',
  },
  {
    name: 'Niños',
    url: '/gender/kid',
  },
];
export function TopMenu() {
  const openMenu = useUiStore((state) => state.openSideMenu);
  const getTotalItems = useCartStore((state) => state.getTotalItems());
  const { favorites } = useFavoriteStore();
  const { theme } = useTheme();
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    setLoaded(true);
  }, []);
  if (!loaded) return null;
  const isDark = theme === 'dark';
  return (
    <nav className="flex px-5 justify-between items-center w-full">
      {/* Logo */}
      <div>
        <Link href="/">
          <span className={`${titleFont.className} antialiased font-bold`}>Teslo</span>
          <span> | Shop</span>
        </Link>
      </div>
      {/* Center Menu */}
      <div className="hidden sm:block">
        {categories.map((category) => (
          <Link
            key={category.url}
            className={clsx(
              'm-2 p-2 rounded-md transition-all',
              isDark ? 'hover:bg-[#222]' : 'hover:bg-gray-100'
            )}
            href={category.url}
          >
            {category.name}
          </Link>
        ))}
      </div>
      {/* Search, Cart, Favorites, Menu */}
      <div className="flex items-center">
        <Link href="/search" className="mx-2">
          <IoSearchOutline className="w-5 h-5" />
        </Link>
        <Link href="/favorites" className="mx-2 relative">
          {favorites.length > 0 && (
            <span className="absolute text-xs px-1 rounded-full font-bold -top-2 -right-2 bg-red-500 text-white">
              {favorites.length}
            </span>
          )}
          <IoHeartOutline className="w-5 h-5 hover:text-red-500 transition-colors" />
        </Link>
        {/* Carrito */}
        <Link href={getTotalItems === 0 && loaded ? '/empty' : '/cart'} className="mx-2 relative">
          {loaded && getTotalItems > 0 && (
            <span className="absolute text-xs px-1 rounded-full font-bold -top-2 -right-2 bg-blue-500 text-white">
              {getTotalItems}
            </span>
          )}
          <IoCartOutline className="w-5 h-5 hover:text-blue-500 transition-colors" />
        </Link>
        {/* Menú */}
        <button
          onClick={openMenu}
          aria-label="Abrir menú"
          className={clsx(
            'm-2 p-2 rounded-md flex items-center justify-center transition-colors duration-200',
            isDark
              ? 'text-gray-100 bg-[#0f0f0f] hover:bg-[#222] border-[#1c1c1c]'
              : 'text-gray-800 bg-white hover:bg-gray-100 border-gray-200'
          )}
        >
          <IoMenuOutline size={26} />
        </button>
      </div>
    </nav>
  );
}
