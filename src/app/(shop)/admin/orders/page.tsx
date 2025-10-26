import { OrderTemplate } from '@/components';
import { getPaginatedOrders } from '@/actions';
import { redirect } from 'next/navigation';
export const revalidate = 0;
export default async function OrdersPage() {
  const { ok, orders = [] } = await getPaginatedOrders();
  if (!ok) {
    redirect('/auth/login');
  }
  return <OrderTemplate title="Todas las ordenes" orders={orders} />;
}
