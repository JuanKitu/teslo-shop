import NextAuth, { NextAuthConfig } from 'next-auth';
import Credentials from "next-auth/providers/credentials";
import { z } from 'zod';
import prisma from "@/lib/prisma";
import bcryptjs from "bcryptjs";

export const authConfig = {
    pages: {
        signIn: '/auth/login',
        newUser: '/auth/new-account',
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.data = user;
            }
            return token;
        },
        async session({ session, token }) {
            if(token.data){
                session.user = token.data;
            }
            return session;
        },
    },
    providers: [
        Credentials({
            async authorize(credentials) {
                const parsedCredentials = z
                    .object({ email: z.email(), password: z.string().min(6) })
                    .safeParse(credentials);
                if (!parsedCredentials.success) return null;
                const { email, password } = parsedCredentials.data;

                const user = await prisma.user.findUnique({
                    where: {
                        email: email.toLowerCase(),
                    },
                })
                if (!user) return null;
                if(!bcryptjs.compareSync(password, user.password)) return null;
                return {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    image: user.image,
                    emailVerified: user.emailVerified,
                };
            },
        }),
    ]
} satisfies NextAuthConfig;

export const {signOut, signIn, auth, handlers} = NextAuth(authConfig);