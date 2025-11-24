'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import clsx from 'clsx';
import { IoCartOutline, IoHeartOutline, IoMenuOutline } from 'react-icons/io5';
import { titleFont } from '@/app/config/fonts';
import { useCartStore, useUiStore, useFavoriteStore } from '@/store';
import { SearchBar } from '@/components';

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
    <nav className="flex flex-col gap-4 px-0 sm:px-10 py-4 w-full">
      {/* Fila superior: Logo, Búsqueda, Acciones */}
      <div className="flex justify-between items-center w-full gap-4">
        {/* Logo */}
        <div className="flex-shrink-0">
          <Link href="/">
            <span className={`${titleFont.className} antialiased font-bold`}>Teslo</span>
            <span> | Shop</span>
          </Link>
        </div>

        {/* Barra de búsqueda - Centrada y responsive */}
        <div className="hidden md:flex flex-1 justify-center max-w-2xl">
          <SearchBar />
        </div>

        {/* Acciones: Favoritos, Carrito, Menú */}
        <div className="flex items-center gap-2">
          <Link href="/favorites" className="relative p-2">
            {favorites.length > 0 && (
              <span className="absolute text-xs px-1 rounded-full font-bold -top-1 -right-1 bg-red-500 text-white">
                {favorites.length}
              </span>
            )}
            <IoHeartOutline className="w-5 h-5 hover:text-red-500 transition-colors" />
          </Link>

          <Link href={getTotalItems === 0 && loaded ? '/empty' : '/cart'} className="relative p-2">
            {loaded && getTotalItems > 0 && (
              <span className="absolute text-xs px-1 rounded-full font-bold -top-1 -right-1 bg-blue-500 text-white">
                {getTotalItems}
              </span>
            )}
            <IoCartOutline className="w-5 h-5 hover:text-blue-500 transition-colors" />
          </Link>

          <button
            onClick={openMenu}
            aria-label="Abrir menú"
            className={clsx(
              'p-2 rounded-md flex items-center justify-center transition-colors duration-200',
              isDark
                ? 'text-gray-100 bg-[#0f0f0f] hover:bg-[#222] border-[#1c1c1c]'
                : 'text-gray-800 bg-white hover:bg-gray-100 border-gray-200'
            )}
          >
            <IoMenuOutline size={26} />
          </button>
        </div>
      </div>

      {/* Fila inferior: Búsqueda mobile */}
      <div className="flex items-center justify-between gap-4 px-5 sm:px-0">
        {/* Búsqueda en mobile */}
        <div className="flex md:hidden w-full">
          <SearchBar />
        </div>
      </div>
    </nav>
  );
}
