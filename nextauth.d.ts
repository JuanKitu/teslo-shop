import { DefaultSession } from "next-auth";

interface User {
    id: string;
    name: string;
    email: string;
    emailVerified: Date | null;
    image?: string;
    role: string;
}

declare module "next-auth" {
    interface Session {
        user: User & DefaultSession["user"];
    }

    type User = User // 👈 usamos tu interfaz
}

declare module "next-auth/jwt" {
    interface JWT {
        data?: User;
    }
}