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
  IoSearchOutline,
  IoShirtOutline,
  IoTicketOutline,
} from 'react-icons/io5';
import { useUiStore } from '@/store';

export const Sidebar = () => {
  const { isSideMenuOpen, closeSideMenu } = useUiStore();
  const { data: session, status, update } = useSession();
  const router = useRouter();

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
    signIn().then(); // ✅ abre el flujo de autenticación configurado
  };

  return (
    <div>
      {/* Overlay oscuro */}
      {isSideMenuOpen && (
        <div className="fixed inset-0 z-10 bg-black/30 backdrop-blur-sm" onClick={closeSideMenu} />
      )}

      {/* Sidebar */}
      <nav
        className={clsx(
          'fixed right-0 top-0 z-20 h-screen w-[80%] sm:w-[400px] md:w-[500px] max-w-full bg-white shadow-2xl p-5 transform transition-transform duration-300',
          {
            'translate-x-full': !isSideMenuOpen,
          }
        )}
      >
        {/* Cerrar menú */}
        <IoCloseOutline
          size={40}
          className="absolute top-5 right-5 cursor-pointer hover:text-gray-600 transition-colors"
          onClick={closeSideMenu}
        />

        {/* Buscar */}
        <div className="relative mt-14">
          <IoSearchOutline size={20} className="absolute top-2 left-2 text-gray-500" />
          <input
            type="text"
            placeholder="Buscar"
            className="w-full bg-gray-50 rounded pl-10 py-2 border-b-2 border-gray-200 text-lg focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* --- Usuario autenticado --- */}
        {isAuthenticated && (
          <>
            <Link
              href="/profile"
              onClick={closeSideMenu}
              className="flex items-center mt-8 p-2 hover:bg-gray-100 rounded transition-all"
            >
              <IoPersonOutline size={28} />
              <span className="ml-3 text-lg">Perfil</span>
            </Link>

            <Link
              href="/orders"
              onClick={closeSideMenu}
              className="flex items-center mt-4 p-2 hover:bg-gray-100 rounded transition-all"
            >
              <IoTicketOutline size={28} />
              <span className="ml-3 text-lg">Órdenes</span>
            </Link>

            <button
              onClick={handleLogout}
              className="flex w-full items-center mt-8 p-2 hover:bg-gray-100 rounded transition-all text-left"
            >
              <IoLogOutOutline size={28} />
              <span className="ml-3 text-lg">Salir</span>
            </button>
          </>
        )}

        {/* --- Usuario no autenticado --- */}
        {!isAuthenticated && (
          <button
            onClick={handleLogin}
            className="flex items-center mt-8 p-2 hover:bg-gray-100 rounded transition-all w-full text-left"
          >
            <IoLogInOutline size={28} />
            <span className="ml-3 text-lg">Ingresar</span>
          </button>
        )}

        {/* --- Zona de administración --- */}
        {isAdmin && (
          <>
            <div className="w-full h-px bg-gray-200 my-10" />

            <Link
              href="/admin/products"
              onClick={closeSideMenu}
              className="flex items-center mt-4 p-2 hover:bg-gray-100 rounded transition-all"
            >
              <IoShirtOutline size={28} />
              <span className="ml-3 text-lg">Productos</span>
            </Link>

            <Link
              href="/admin/orders"
              onClick={closeSideMenu}
              className="flex items-center mt-4 p-2 hover:bg-gray-100 rounded transition-all"
            >
              <IoTicketOutline size={28} />
              <span className="ml-3 text-lg">Órdenes</span>
            </Link>

            <Link
              href="/admin/users"
              onClick={closeSideMenu}
              className="flex items-center mt-4 p-2 hover:bg-gray-100 rounded transition-all"
            >
              <IoPeopleOutline size={28} />
              <span className="ml-3 text-lg">Usuarios</span>
            </Link>
          </>
        )}
      </nav>
    </div>
  );
};
