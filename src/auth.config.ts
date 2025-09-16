import NextAuth, { NextAuthConfig } from 'next-auth';
import Credentials from "@auth/core/providers/credentials";
import { z } from 'zod';

export const authConfig = {
    pages: {
        signIn: '/auth/login',
        newUser: '/auth/new-account',
    },
    providers: [
        Credentials({
            async authorize(credentials) {
                const parsedCredentials = z
                    .object({ email: z.email(), password: z.string().min(6) })
                    .safeParse(credentials);
                if (!parsedCredentials.success) return null;
                const { email, password } = parsedCredentials.data;
                console.log(email, password);
                return null;
            },
        }),
    ]
} satisfies NextAuthConfig;

export const {signOut, signIn, auth} = NextAuth(authConfig);