'use client';
import { SessionProvider } from 'next-auth/react';
import { PayPalScriptProvider } from '@paypal/react-paypal-js';
import { ThemeProvider } from 'next-themes';
import React from 'react';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <PayPalScriptProvider
        options={{
          clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID ?? '',
          currency: 'USD',
          intent: 'capture',
        }}
      >
        <SessionProvider>{children}</SessionProvider>
      </PayPalScriptProvider>
    </ThemeProvider>
  );
}
