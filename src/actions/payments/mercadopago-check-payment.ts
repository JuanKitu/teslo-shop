'use server';

import prisma from '@/lib/prisma';
import { MercadoPagoConfig, Payment } from 'mercadopago';

export async function mercadopagoCheckPayment(paymentId: string) {
  try {
    const client = new MercadoPagoConfig({
      accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN!,
    });

    const payment = new Payment(client);
    const resp = await payment.get({ id: paymentId });

    if (!resp) {
      return { ok: false, message: 'Error al verificar el pago con Mercado Pago' };
    }

    const orderId = resp.external_reference; // viene del campo que setea la preferencia

    if (resp.status !== 'approved') {
      return { ok: false, message: 'Aún no se ha acreditado el pago en Mercado Pago' };
    }

    // Actualizamos la orden igual que con PayPal
    await prisma.order.update({
      where: { id: orderId },
      data: {
        isPaid: true,
        paidAt: new Date(),
        transactionId: String(paymentId),
      },
    });

    //revalidatePath(`/orders/${orderId}`);

    return { ok: true, message: 'Pago verificado con éxito' };
  } catch (error) {
    console.error(error);
    return { ok: false, message: '500 - Error al verificar el pago' };
  }
}
