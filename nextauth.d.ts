/* eslint-disable @typescript-eslint/no-empty-object-type */
import { DefaultUser } from 'next-auth';

interface IUser extends DefaultUser {
  /**
   * Roles del usuario
   */
  id: string;
  name: string;
  email: string;
  emailVerified: Date | null;
  role: string;
  image?: string;
  /**
   * Agregar cualquier otro campo que tu manejas
   */
}

declare module 'next-auth' {
  interface User extends IUser {}

  interface Session {
    user?: User;
  }
}

declare module 'next-auth/jwt' {
  interface JWT extends IUser {}
}
