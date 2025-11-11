'use client';

import React, { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import clsx from 'clsx';
import { getUsersTableStyles, TABLE_HEADERS } from './styles';
import { UserRow } from './components/UserRow';
import { UserCard } from './components/UserCard';
import type { UsersTableProps } from './users-table.interface';

export function UsersTable({ users }: UsersTableProps) {
  const [mounted, setMounted] = useState(false);
  const { theme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Evitar problemas de hidratación
  if (!mounted) {
    const styles = getUsersTableStyles(false);
    return (
      <div className={styles.container}>
        <div className={styles.skeleton} />
      </div>
    );
  }

  const isDark = theme === 'dark';
  const styles = getUsersTableStyles(isDark);

  // Estado vacío
  if (!users || users.length === 0) {
    return (
      <div className={styles.emptyState}>
        <p className="text-lg font-semibold mb-2">No hay usuarios</p>
        <p className="text-sm text-gray-500">No se encontraron usuarios en el sistema</p>
      </div>
    );
  }

  return (
    <div>
      {/* 📱 Vista Mobile - Cards */}
      <div className="md:hidden space-y-3">
        {users.map((user) => (
          <UserCard key={user.id} user={user} isDark={isDark} />
        ))}
      </div>

      {/* 💻 Vista Desktop - Table */}
      <div className="hidden md:block">
        <div className={styles.container}>
          <table className={styles.table}>
            <caption className="sr-only">Lista de usuarios del sistema</caption>

            <thead className={styles.thead}>
              <tr>
                {TABLE_HEADERS.map((header) => (
                  <th key={header} scope="col" className={styles.th}>
                    {header}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {users.map((user) => (
                <UserRow key={user.id} user={user} isDark={isDark} />
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer info */}
      <div className={clsx('mt-4 text-sm text-center', isDark ? 'text-gray-400' : 'text-gray-500')}>
        {users.length} {users.length === 1 ? 'usuario' : 'usuarios'} en total
      </div>
    </div>
  );
}
