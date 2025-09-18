import { ReactNode } from "react";
import { auth } from "@/auth.config";
import {redirect} from "next/navigation";
import HotSessionWatcher from "@/components/session/HotSessionWatcher"; // client component

interface ProtectedLayoutProps {
    children: ReactNode;
}

export default async function ProtectedLayout({ children }: ProtectedLayoutProps) {
    const session = await auth();
    if (!session?.user) {
        redirect("/auth/login");
    }

    return (
        <>
            <HotSessionWatcher />
            {children}
        </>
    );
}