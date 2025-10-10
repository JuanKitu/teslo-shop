'use client';
import React from 'react';
import { IoAlertCircle, IoClose } from "react-icons/io5";

interface Props {
    message: string;
    onClose: () => void;
}

export function CartWarning({ message, onClose }: Props) {
    return (
        <div className="flex items-center justify-between gap-2 mt-2 bg-amber-50 border border-amber-200 text-amber-900 rounded-md px-4 py-2 shadow-sm fade-in">
            <div className="flex items-center gap-2">
                <IoAlertCircle className="h-5 w-5 flex-shrink-0" />
                <span className="text-sm">{message}</span>
            </div>
            <button
                onClick={onClose}
                className="p-1 rounded hover:bg-amber-200/50 transition"
                aria-label="Cerrar alerta"
            >
                <IoClose className="h-4 w-4" />
            </button>
        </div>
    );
}
