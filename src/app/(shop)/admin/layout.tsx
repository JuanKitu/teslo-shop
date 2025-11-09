import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import type { Session } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session: Session | null = await getServerSession(authOptions);

  if (session?.user?.role !== 'admin') {
    redirect('/api/auth/signin');
  }

  return <>{children}</>;
}
