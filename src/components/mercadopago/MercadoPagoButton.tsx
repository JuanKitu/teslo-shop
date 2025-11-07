'use client';

import React, { useEffect, useState } from 'react';
import { Wallet } from '@mercadopago/sdk-react';
import { createMercadoPagoPreference } from '@/actions';

interface Props {
  orderId: string;
  amount: number;
}

export function MercadoPagoButton({ orderId, amount }: Props) {
  const [preferenceId, setPreferenceId] = useState<string | null | undefined>(null);

  useEffect(() => {
    (async () => {
      const id = await createMercadoPagoPreference(orderId, amount);
      setPreferenceId(id);
    })();
  }, [orderId, amount]);

  if (!preferenceId) {
    return (
      <div className="animate-pulse mb-16">
        <div className="h-11 bg-gray-300 rounded"></div>
      </div>
    );
  }

  return (
    <div className="relative z-0">
      <Wallet initialization={{ preferenceId }} />
    </div>
  );
}
