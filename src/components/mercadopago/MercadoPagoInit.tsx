'use client';

import { useEffect } from 'react';
import { initMercadoPago } from '@mercadopago/sdk-react';

export function MercadoPagoInit() {
  useEffect(() => {
    initMercadoPago(process.env.NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY!, {
      locale: 'es-AR',
    });
  }, []);

  return null; // no renderiza nada
}
