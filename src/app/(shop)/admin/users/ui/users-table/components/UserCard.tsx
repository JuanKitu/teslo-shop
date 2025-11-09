import React from 'react';
import clsx from 'clsx';
import { getUserCardStyles, ROLE_OPTIONS } from '../styles';
import { useUserRole } from '../hooks/useUserRole';
import type { UserRowProps } from '../users-table.interface';

export const UserCard: React.FC<UserRowProps> = ({ user, isDark }) => {
  const styles = getUserCardStyles(isDark);
  const { role, isUpdating, error, handleRoleChange } = useUserRole(user.id, user.role);

  return (
    <div className={styles.card}>
      {/* Header con avatar y nombre */}
      <div className="flex items-center gap-3 mb-4">
        <div
          className={clsx(
            'w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0',
            isDark ? 'bg-blue-950 text-blue-400' : 'bg-blue-100 text-blue-600'
          )}
        >
          {user.email.charAt(0).toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <h3
            className={clsx(
              'font-medium truncate',
              isDark ? 'text-[var(--color-text)]' : 'text-gray-900'
            )}
          >
            {user.name}
          </h3>
          <p className={clsx('text-sm truncate', isDark ? 'text-gray-400' : 'text-gray-500')}>
            {user.email}
          </p>
        </div>
      </div>

      {/* Rol selector */}
      <div className="space-y-2">
        <label
          className={clsx('text-sm font-medium block', isDark ? 'text-gray-400' : 'text-gray-600')}
        >
          Rol del usuario
        </label>

        <div className="flex items-center gap-2">
          <span className={styles.badge(role)}>{role === 'admin' ? '👑' : '👤'}</span>

          <select
            className={clsx(styles.select, 'flex-1', isUpdating && 'opacity-50 cursor-wait')}
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

          <div className="w-5 h-5 flex items-center justify-center flex-shrink-0">
            {isUpdating && (
              <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
            )}
          </div>
        </div>

        {error && <p className="text-xs text-red-500">{error}</p>}
      </div>
    </div>
  );
};
