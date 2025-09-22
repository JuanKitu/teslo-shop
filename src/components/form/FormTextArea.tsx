'use client';

import { FieldError, UseFormRegisterReturn } from "react-hook-form";
import clsx from "clsx";
import AlertText from "./AlertText";

interface Props {
    label: string;
    registration: UseFormRegisterReturn;
    autoFocus?: boolean;
    error?: FieldError;
    className?: string;
    classNameInput?: string;
    rows?: number;
}

export function FormTextArea({ label, registration, error, className, autoFocus, classNameInput, rows }: Props) {
    return (
        <div className={`flex flex-col ${className}`}>
            {error && <AlertText message={`${label} es requerido`} />}

            <label className="mb-1">{label}</label>
            <textarea
                autoFocus = {autoFocus}
                {...registration}
                rows={rows}
                className={clsx(
                    `border bg-gray-200 ${classNameInput}`,
                    { "border-red-500": error }
                )}
            />
        </div>
    );
}