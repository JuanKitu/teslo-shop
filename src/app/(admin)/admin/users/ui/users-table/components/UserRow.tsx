import React from 'react';
import clsx from 'clsx';
import { getUsersTableStyles, ROLE_OPTIONS } from '../styles';
import { useUserRole } from '../hooks/useUserRole';
import type { UserRowProps } from '../users-table.interface';

export const UserRow: React.FC<UserRowProps> = ({ user, isDark }) => {
  const styles = getUsersTableStyles(isDark);
  const { role, isUpdating, error, handleRoleChange } = useUserRole(user.id, user.role);

  return (
    <tr className={styles.row}>
      {/* Email */}
      <td className={styles.tdEmail}>
        <div className="flex items-center gap-2">
          <div
            className={clsx(
              'w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0',
              isDark ? 'bg-blue-950 text-blue-400' : 'bg-blue-100 text-blue-600'
            )}
          >
            {user.email.charAt(0).toUpperCase()}
          </div>
          <span>{user.email}</span>
        </div>
      </td>

      {/* Nombre completo */}
      <td className={clsx(styles.td, 'font-light')}>{user.name}</td>

      {/* Rol - ✅ Grid para alineación perfecta */}
      <td className={styles.td}>
        <div className="grid grid-cols-[auto_1fr_20px] gap-2 items-center">
          {/* Badge - columna 1 */}
          <span className={styles.badge(role)}>{role === 'admin' ? '👑' : '👤'}</span>

          {/* Select - columna 2 */}
          <select
            className={clsx(styles.select, isUpdating && 'opacity-50 cursor-wait')}
            value={role}
            onChange={(e) => handleRoleChange(e.target.value)}
            disabled={isUpdating}
            aria-label={`Cambiar rol de ${user.name}`}
          >
            {ROLE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          {/* Spinner - columna 3 con ancho fijo */}
          <div className="flex items-center justify-center">
            {isUpdating && (
              <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
            )}
          </div>
        </div>

        {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
      </td>
    </tr>
  );
};
