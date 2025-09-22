'use client';
import React, {useActionState, useEffect} from 'react'
import Link from "next/link";

import {authenticate} from "@/actions";
import {IoAlertCircle} from "react-icons/io5";
import {LoginButton} from "@/app/auth/login/ui/LoginButton";
import {useSearchParams} from "next/navigation";
import {useRouter} from "next/navigation";
import {useSession} from "next-auth/react";
export function LoginForm() {
    const [errorMessage, formAction, isPending] = useActionState(
        authenticate,
        undefined,
    );
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get('callbackUrl') || '/';
    const router = useRouter();
    const { update } = useSession();
    useEffect(() => {
        if (errorMessage === 'Success') {
            (async () => {
                await update();
                router.replace(callbackUrl);
            })();
        }
    }, [callbackUrl, errorMessage, router, update]);
    return (
        <form action={formAction} className="flex flex-col">

            <label htmlFor="email">Correo electrónico</label>
            <input
                className="px-5 py-2 border bg-gray-200 rounded mb-5"
                name="email"
                type="email" />


            <label htmlFor="email">Contraseña</label>
            <input
                className="px-5 py-2 border bg-gray-200 rounded mb-5"
                name="password"
                type="password" />
            {/*<input type="hidden" name="redirectTo" value={callbackUrl} />*/}
            <LoginButton isPending={isPending} />


            {/* divisor l ine */ }
            <div className="flex items-center my-5">
                <div className="flex-1 border-t border-gray-500"></div>
                <div className="px-2 text-gray-800">O</div>
                <div className="flex-1 border-t border-gray-500"></div>
            </div>

            <Link
                href="/auth/new-account"
                className="btn-secondary text-center">
                Crear una nueva cuenta
            </Link>
            {
                (errorMessage && errorMessage !== 'Success') && (
                    <div
                        className="mt-4 rounded-lg bg-red-100 p-3 text-sm text-red-700 flex items-center gap-2 fade-in"
                        aria-live="polite"
                        aria-atomic="true"
                    >
                        <IoAlertCircle className="h-5 w-5 flex-shrink-0 text-red-500" />
                        <span>{errorMessage ?? "Ocurrió un error al iniciar sesión"}</span>
                    </div>
                )}

        </form>
    )
}
