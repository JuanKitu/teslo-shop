'use client';
import {FieldError, UseFormRegisterReturn} from "react-hook-form";
import AlertText from "./AlertText";

interface SelectProps<T> {
    label: string;
    registration: UseFormRegisterReturn;
    error?: FieldError;
    className?: string;
    options: T[];
    getOptionValue: (opt: T) => string;
    getOptionLabel: (opt: T) => string;
}

export function FormSelect<T>({
                                  label, registration, error, className, options, getOptionValue, getOptionLabel
                              }: SelectProps<T>) {
    return (
        <div className={`flex flex-col ${className}`}>
            {error && <AlertText message={`${label} es requerido`} />}
            <label className="mb-1">{label}</label>
            <select
                {...registration}
                className="px-5 py-2 border bg-gray-200 rounded appearance-none leading-tight"
            >
                {options.map((opt) => (
                    <option key={getOptionValue(opt)} value={getOptionValue(opt)}>
                        {getOptionLabel(opt)}
                    </option>
                ))}
            </select>
        </div>
    );
}