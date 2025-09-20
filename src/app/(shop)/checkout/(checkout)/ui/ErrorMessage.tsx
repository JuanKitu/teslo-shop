import React from 'react'
import {IoWarningOutline} from "react-icons/io5";
interface Props {
    errorMessage: string;
}
export function ErrorMessage({ errorMessage = 'Error desconocido'}: Props) {
    return (
        <div className="mt-4 flex items-center gap-2 rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">
            <IoWarningOutline className="h-5 w-5 shrink-0 text-red-500" />
            <span>{errorMessage}</span>
        </div>
    )
}
