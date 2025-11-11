'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import clsx from 'clsx';
import { useSession, signOut, signIn } from 'next-auth/react';
import {
  IoCloseOutline,
  IoLogInOutline,
  IoLogOutOutline,
  IoPeopleOutline,
  IoPersonOutline,
  IoShirtOutline,
  IoTicketOutline,
} from 'react-icons/io5';
import { useUiStore } from '@/store';
import { ThemeToggle } from '@/components';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export const Sidebar = () => {
  const { isSideMenuOpen, closeSideMenu } = useUiStore();
  const { data: session, status, update } = useSession();
  const router = useRouter();
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const isAuthenticated = status === 'authenticated';
  const isAdmin = session?.user?.role === 'admin';

  const handleLogout = async () => {
    await signOut({ redirect: false });
    await update();
    closeSideMenu();
    router.refresh();
  };

  const handleLogin = () => {
    closeSideMenu();
    signIn();
  };

  // 🧩 Evitamos renderizar hasta montar para prevenir errores de hidratación
  if (!mounted) return null;

  const isDark = theme === 'dark';

  return (
    <div>
      {isSideMenuOpen && (
        <div className="fixed inset-0 z-10 bg-black/30 backdrop-blur-sm" onClick={closeSideMenu} />
      )}

      <nav
        className={clsx(
          'fixed right-0 top-0 z-20 h-screen w-[80%] sm:w-[400px] md:w-[500px] max-w-full p-5 transform transition-transform duration-300 shadow-2xl border-l',
          {
            'translate-x-full': !isSideMenuOpen,
            'bg-white text-gray-900 border-gray-200': !isDark,
            'bg-[var(--color-bg)] text-[var(--color-text)] border-[var(--color-border)]': isDark,
          }
        )}
      >
        {/* Cerrar menú */}
        <IoCloseOutline
          size={40}
          className={clsx(
            'absolute top-5 right-5 cursor-pointer transition-colors',
            isDark ? 'hover:text-gray-400' : 'hover:text-gray-600'
          )}
          onClick={closeSideMenu}
        />

        <div className="relative mt-8 mb-4">
          <ThemeToggle />
        </div>

        {/* Usuario autenticado */}
        {isAuthenticated && (
          <>
            <Link
              href="/profile"
              onClick={closeSideMenu}
              className={clsx(
                'flex items-center mt-6 p-2 rounded transition-all',
                isDark ? 'hover:bg-[var(--color-card)]' : 'hover:bg-gray-100'
              )}
            >
              <IoPersonOutline size={26} />
              <span className="ml-3 text-lg">Perfil</span>
            </Link>

            <Link
              href="/orders"
              onClick={closeSideMenu}
              className={clsx(
                'flex items-center mt-3 p-2 rounded transition-all',
                isDark ? 'hover:bg-[var(--color-card)]' : 'hover:bg-gray-100'
              )}
            >
              <IoTicketOutline size={26} />
              <span className="ml-3 text-lg">Órdenes</span>
            </Link>

            <button
              onClick={handleLogout}
              className={clsx(
                'flex w-full items-center mt-6 p-2 rounded transition-all text-left',
                isDark ? 'hover:bg-[var(--color-card)]' : 'hover:bg-gray-100'
              )}
            >
              <IoLogOutOutline size={26} />
              <span className="ml-3 text-lg">Salir</span>
            </button>
          </>
        )}

        {/* Usuario no autenticado */}
        {!isAuthenticated && (
          <button
            onClick={handleLogin}
            className={clsx(
              'flex items-center mt-6 p-2 rounded transition-all w-full text-left',
              isDark ? 'hover:bg-[var(--color-card)]' : 'hover:bg-gray-100'
            )}
          >
            <IoLogInOutline size={26} />
            <span className="ml-3 text-lg">Ingresar</span>
          </button>
        )}

        {/* Administración */}
        {isAdmin && (
          <>
            <div
              className={clsx(
                'w-full h-px my-8',
                isDark ? 'bg-[var(--color-border)]' : 'bg-gray-200'
              )}
            />

            <Link
              href="/admin/products"
              onClick={closeSideMenu}
              className={clsx(
                'flex items-center mt-4 p-2 rounded transition-all',
                isDark ? 'hover:bg-[var(--color-card)]' : 'hover:bg-gray-100'
              )}
            >
              <IoShirtOutline size={26} />
              <span className="ml-3 text-lg">Productos</span>
            </Link>

            <Link
              href="/admin/orders"
              onClick={closeSideMenu}
              className={clsx(
                'flex items-center mt-4 p-2 rounded transition-all',
                isDark ? 'hover:bg-[var(--color-card)]' : 'hover:bg-gray-100'
              )}
            >
              <IoTicketOutline size={26} />
              <span className="ml-3 text-lg">Órdenes</span>
            </Link>

            <Link
              href="/admin/users"
              onClick={closeSideMenu}
              className={clsx(
                'flex items-center mt-4 p-2 rounded transition-all',
                isDark ? 'hover:bg-[var(--color-card)]' : 'hover:bg-gray-100'
              )}
            >
              <IoPeopleOutline size={26} />
              <span className="ml-3 text-lg">Usuarios</span>
            </Link>
          </>
        )}
      </nav>
    </div>
  );
};
