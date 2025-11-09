'use client';

import React, { useEffect, useState } from 'react';
import { Wallet } from '@mercadopago/sdk-react';
import { useTheme } from 'next-themes';
import { createMercadoPagoPreference } from '@/actions';
import {
  IWalletBrickDarkCustomization,
  IWalletBrickDefaultCustomization,
} from '@mercadopago/sdk-react/esm/bricks/wallet/types';

interface Props {
  orderId: string;
  amount: number;
}

export function MercadoPagoButton({ orderId, amount }: Props) {
  const [preferenceId, setPreferenceId] = useState<string | null | undefined>(null);
  const { theme } = useTheme();
  const isDark = theme === 'dark';
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

  const customization: IWalletBrickDarkCustomization | IWalletBrickDefaultCustomization = {
    theme: isDark ? 'dark' : 'default',
    customStyle: {
      hideValueProp: true,
    },
  };

  return (
    <div className="relative z-0">
      <Wallet customization={customization} initialization={{ preferenceId }} />
    </div>
  );
}
