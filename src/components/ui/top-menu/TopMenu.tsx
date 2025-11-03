'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { titleFont } from '@/app/config/fonts';
import { IoCartOutline, IoSearchOutline, IoHeartOutline } from 'react-icons/io5';
import { useCartStore, useUiStore, useFavoriteStore } from '@/store';

export function TopMenu() {
  const openMenu = useUiStore((state) => state.openSideMenu);
  const getTotalItems = useCartStore((state) => state.getTotalItems());
  const { favorites } = useFavoriteStore();
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    setLoaded(true);
  }, []);
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
        <Link className="m-2 p-2 rounded-md transition-all hover:bg-gray-100" href="/gender/men">
          Hombres
        </Link>
        <Link className="m-2 p-2 rounded-md transition-all hover:bg-gray-100" href="/gender/women">
          Mujeres
        </Link>
        <Link className="m-2 p-2 rounded-md transition-all hover:bg-gray-100" href="/gender/kid">
          Niños
        </Link>
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
          <IoHeartOutline className="w-5 h-5 text-gray-600 hover:text-red-500 transition-colors" />
        </Link>

        {/* Carrito */}
        <Link href={getTotalItems === 0 && loaded ? '/empty' : '/cart'} className="mx-2 relative">
          {loaded && getTotalItems > 0 && (
            <span className="absolute text-xs px-1 rounded-full font-bold -top-2 -right-2 bg-blue-500 text-white">
              {getTotalItems}
            </span>
          )}
          <IoCartOutline className="w-5 h-5" />
        </Link>
        {/* Menú */}
        <button
          className="m-2 p-2 rounded-md transition-all hover:bg-gray-100"
          onClick={() => openMenu()}
        >
          Menú
        </button>
      </div>
    </nav>
  );
}
