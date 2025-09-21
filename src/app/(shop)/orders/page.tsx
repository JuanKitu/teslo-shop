import {OrderTemplate} from '@/components';
import {getOrdersByUser} from "@/actions";
import {redirect} from "next/navigation";
export const revalidate = 0;
export default async function OrdersPage() {
    const {ok, orders = []} = await getOrdersByUser();
    if(!ok){
        redirect('/auth/login');
    }
    return (
        <OrderTemplate
            title="Mis ordenes"
            orders={orders}
        />
    );
}