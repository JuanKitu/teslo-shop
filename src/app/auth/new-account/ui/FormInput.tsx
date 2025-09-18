'use client';

import { FieldError, UseFormRegisterReturn } from "react-hook-form";
import clsx from "clsx";
import AlertText from "@/app/auth/new-account/ui/AlertText";

interface Props {
    label: string;
    type?: string;
    registration: UseFormRegisterReturn;
    error?: FieldError;
}

export default function FormInput({ label, type = "text", registration, error }: Props) {
    return (
        <div className="flex flex-col mb-4">
            {error && <AlertText message={`${label} es requerido`} />}

            <label className="mb-1">{label}</label>
            <input
                type={type}
                {...registration}
                className={clsx(
                    "px-5 py-2 border bg-gray-200 rounded",
                    { "border-red-500": error }
                )}
            />
        </div>
    );
}