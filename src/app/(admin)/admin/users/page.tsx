import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { Title } from '@/components';
import { getPaginatedUsers } from '@/actions';
import { UsersTable } from './ui/users-table/UsersTable';

export const revalidate = 0;

export default async function UsersAdminPage() {
  // 🔒 Protección server-side
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== 'admin') {
    redirect('/api/auth/signin');
  }

  const { ok, users = [] } = await getPaginatedUsers();
  void ok;
  return (
    <>
      <Title title="Mantenimiento de usuarios" />
      <div className="mb-10">
        <UsersTable users={users} />
      </div>
    </>
  );
}
