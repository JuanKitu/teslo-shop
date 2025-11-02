import NextAuth, { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import prisma from '@/lib/prisma';
import { signInEmailPassword } from '@/actions';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: 'jwt',
  },
  // Configure one or more authentication providers
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? '',
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Correo electrónico', type: 'email', placeholder: 'user@email.com' },
        password: { label: 'Contraseña', type: 'password', placeholder: '*********' },
      },
      async authorize(credentials) {
        const user = await signInEmailPassword(
          credentials?.email ?? '',
          credentials?.password ?? ''
        );
        if (user) {
          return user;
        }
        return null;
      },
    }),
  ],
  callbacks: {
    async signIn() {
      return true;
    },
    async jwt({ token }) {
      const dbUser = await prisma.user.findUnique({ where: { email: token.email ?? 'no-email' } });
      token.role = dbUser?.role ?? 'no-roles';
      token.id = dbUser?.id ?? 'no-id';
      return token;
    },
    async session({ session, token }) {
      if (session && session.user) {
        session.user.role = token.role;
        session.user.id = token.id;
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
