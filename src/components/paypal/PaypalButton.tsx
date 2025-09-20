'use client';
import React from 'react'
import {PayPalButtons, usePayPalScriptReducer} from "@paypal/react-paypal-js";

export function PaypalButton() {
    const [{ isPending }] = usePayPalScriptReducer();
    if(isPending) return (
        <div className="animate-pulse mb-16">
            <div className="h-11 bg-gray-300 rounded"></div>
            <div className="h-11 bg-gray-300 rounded mt-2"></div>

        </div>
    )
    return (
        <PayPalButtons />
    )
}
