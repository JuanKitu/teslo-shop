import type { User } from '@/interfaces';

export interface UsersTableProps {
  users: User[];
}

export interface UserRowProps {
  user: User;
  isDark: boolean;
}

export type UserRole = 'admin' | 'user';

export interface RoleOption {
  value: UserRole;
  label: string;
  color: string;
}
