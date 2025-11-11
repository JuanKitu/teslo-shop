import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import type { Session } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { AdminMenu } from '@/components';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session: Session | null = await getServerSession(authOptions);

  if (session?.user?.role !== 'admin') {
    redirect('/api/auth/signin');
  }

  return (
    <div className="flex min-h-screen">
      <aside className="hidden md:block w-64 lg:w-72 flex-shrink-0">
        <div className="sticky top-0 h-screen overflow-y-auto">
          <AdminMenu />
        </div>
      </aside>

      <main className="flex-1 overflow-x-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 max-w-[1600px]">{children}</div>
      </main>
    </div>
  );
}
