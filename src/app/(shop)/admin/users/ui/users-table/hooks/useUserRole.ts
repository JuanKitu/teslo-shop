import { useState } from 'react';
import { changeUserRole } from '@/actions';

export const useUserRole = (userId: string, initialRole: string) => {
  const [role, setRole] = useState(initialRole);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRoleChange = async (newRole: string) => {
    if (newRole === role) return;

    setIsUpdating(true);
    setError(null);

    // Optimistic update
    const previousRole = role;
    setRole(newRole);

    try {
      await changeUserRole(userId, newRole);
    } catch (err) {
      // Revertir en caso de error
      setRole(previousRole);
      setError('Error al actualizar el rol');
      console.error('Error changing user role:', err);
    } finally {
      setIsUpdating(false);
    }
  };

  return {
    role,
    isUpdating,
    error,
    handleRoleChange,
  };
};
