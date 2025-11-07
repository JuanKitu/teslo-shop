'use server';

import { MercadoPagoConfig, Preference } from 'mercadopago';

const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN!,
});

export async function createMercadoPagoPreference(orderId: string, amount: number) {
  try {
    const preference = new Preference(client);

    const result = await preference.create({
      body: {
        items: [
          {
            id: orderId,
            title: `Orden #${orderId}`,
            quantity: 1,
            unit_price: amount,
            currency_id: 'ARS',
          },
        ],
        back_urls: {
          success: `${process.env.NEXT_PUBLIC_SITE_URL}/orders/${orderId}?status=success`,
          failure: `${process.env.NEXT_PUBLIC_SITE_URL}/orders/${orderId}?status=failure`,
          pending: `${process.env.NEXT_PUBLIC_SITE_URL}/orders/${orderId}?status=pending`,
        },
        auto_return: 'approved',
        notification_url: `${process.env.NEXT_PUBLIC_SITE_URL}/api/mercadopago/webhook`,
        external_reference: orderId,
      },
    });

    return result.id; // preferenceId
  } catch (error) {
    console.error(error);
    return null;
  }
}
