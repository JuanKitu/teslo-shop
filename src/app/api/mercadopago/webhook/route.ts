import { NextResponse } from 'next/server';
import { MercadoPagoConfig, Payment } from 'mercadopago';
import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log('📦 Webhook recibido:', body);

    // Mercado Pago envía varios tipos: payment, merchant_order, etc.
    if (body.type !== 'payment') {
      return NextResponse.json({ ok: true, message: 'Evento ignorado (no es payment)' });
    }

    const paymentId = body.data.id;
    const client = new MercadoPagoConfig({
      accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN!,
    });

    const payment = new Payment(client);
    const resp = await payment.get({ id: paymentId });

    if (!resp) {
      console.error('❌ Error al obtener pago', paymentId);
      return NextResponse.json({ ok: false, message: 'No se pudo obtener pago' }, { status: 400 });
    }

    const orderId = resp.external_reference;

    if (resp.status === 'approved') {
      await prisma.order.update({
        where: { id: orderId },
        data: {
          isPaid: true,
          paidAt: new Date(),
          transactionId: String(paymentId),
        },
      });

      revalidatePath(`/orders/${orderId}`);
      console.log(`✅ Orden ${orderId} marcada como pagada`);
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('💥 Error en webhook:', error);
    return NextResponse.json({ ok: false, error: 'Error interno' }, { status: 500 });
  }
}
