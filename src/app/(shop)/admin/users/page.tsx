import {Title} from '@/components';
import {getPaginatedUsers} from "@/actions";
import {redirect} from "next/navigation";
import {UsersTable} from "./ui/UsersTable";
export const revalidate = 0;
export default async function UsersAdminPage() {
    const {ok, users = []} = await getPaginatedUsers();
    if(!ok){
        redirect('/auth/login');
    }
    return (
        <>
            <Title title="Mantenimiento de usuarios"/>
            <div className="mb-10">
                <UsersTable users={users} />
            </div>
        </>
    );
}