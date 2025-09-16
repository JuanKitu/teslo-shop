'use client';
import React, {useActionState} from 'react'
import Link from "next/link";

import {authenticate} from "@/actions";
import {IoAlertCircle} from "react-icons/io5";
export function LoginForm() {
    const [errorMessage, formAction, isPending] = useActionState(
        authenticate,
        undefined,
    );
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

            <button
                type="submit"
                disabled={isPending}
                className="btn-primary">
                Ingresar
            </button>


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
            <div
                className="mt-4 rounded-lg bg-red-100 p-3 text-sm text-red-700 flex items-center gap-2"
                aria-live="polite"
                aria-atomic="true"
            >
                {errorMessage  && (
                    <>
                        <IoAlertCircle className="h-5 w-5 flex-shrink-0 text-red-500" />
                        <span>{errorMessage ?? "Ocurrió un error al iniciar sesión"}</span>
                    </>
                )}
            </div>
        </form>
    )
}
