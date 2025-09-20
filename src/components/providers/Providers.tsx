'use client';
import {SessionProvider} from "next-auth/react";
import {PayPalScriptProvider} from "@paypal/react-paypal-js";

interface Props {
    children: React.ReactNode;
}
export function Providers({children}: Props) {
    return (
        <PayPalScriptProvider options={{
            clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID ?? '',
            currency: 'USD',
            intent: 'capture',
        }}>
            <SessionProvider>
            {children}
            </SessionProvider>
        </PayPalScriptProvider>
    )
}
