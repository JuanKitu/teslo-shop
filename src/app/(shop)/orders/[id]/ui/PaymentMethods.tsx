import { MercadoPagoButton, PaypalButton } from '@/components';
import React from 'react';
interface Props {
  amount: number;
  orderId: string;
}
export default function PaymentMethods({ amount, orderId }: Props) {
  return (
    <>
      <PaypalButton amount={amount} orderId={orderId} />
      <MercadoPagoButton amount={amount} orderId={orderId} />
    </>
  );
}
