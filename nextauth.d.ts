export interface IUser {
  id: string;
  name: string;
  email: string;
  emailVerified: Date | null;
  role: string;
  image?: string;
}

declare module 'next-auth' {
  interface Session {
    user: IUser; // ✅ tu User, nada de AdapterUser
  }

  // ✅ esta línea es la que corta con AdapterUser
  type User = IUser;
}

declare module 'next-auth/jwt' {
  interface JWT {
    data?: IUser;
  }
}
