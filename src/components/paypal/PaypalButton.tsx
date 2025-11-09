'use client';

import React from 'react';
import { PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js';
import type {
  CreateOrderActions,
  CreateOrderData,
  PayPalButtonCreateOrder,
  PayPalButtonOnApprove,
  OnApproveActions,
  OnApproveData,
} from '@paypal/paypal-js';
import { setTransactionId } from '@/actions';
import { paypalCheckPayment } from '@/actions/payments/paypal-check-payment';
import { useTheme } from 'next-themes';
import clsx from 'clsx';

interface Props {
  orderId: string;
  amount: number;
}

export function PaypalButton({ orderId, amount }: Props) {
  const [{ isPending }] = usePayPalScriptReducer();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const roundAmount = (Math.round(amount * 100) / 100).toFixed(2);

  const createOrder: PayPalButtonCreateOrder = async (
    data: CreateOrderData,
    actions: CreateOrderActions
  ): Promise<string> => {
    const transactionId = await actions.order.create({
      intent: 'CAPTURE',
      purchase_units: [
        {
          invoice_id: orderId,
          amount: {
            value: `${roundAmount}`,
            currency_code: 'USD',
          },
        },
      ],
    });

    const isSetTransaction = await setTransactionId(orderId, transactionId);
    if (!isSetTransaction.ok) throw new Error('Error setting transaction id');

    return transactionId;
  };

  const onApprove: PayPalButtonOnApprove = async (
    data: OnApproveData,
    actions: OnApproveActions
  ): Promise<void> => {
    const details = await actions.order?.capture();
    if (!details || !details.id) return;
    await paypalCheckPayment(details.id);
  };

  if (isPending)
    return (
      <div className="animate-pulse mb-16">
        <div
          className={clsx('h-11 rounded', isDark ? 'bg-[var(--color-border)]' : 'bg-gray-300')}
        ></div>
        <div
          className={clsx('h-11 rounded mt-2', isDark ? 'bg-[var(--color-border)]' : 'bg-gray-300')}
        ></div>
      </div>
    );

  return (
    <div className="relative z-0">
      <PayPalButtons
        style={{
          color: isDark ? 'black' : 'gold', // 'blue' | 'gold' | 'silver' | 'white' | 'black'
          shape: 'rect', // 'rect' | 'pill'
          layout: 'vertical', // 'vertical' | 'horizontal'
          label: 'pay',
          height: 48,
        }}
        createOrder={createOrder}
        onApprove={onApprove}
      />
    </div>
  );
}
