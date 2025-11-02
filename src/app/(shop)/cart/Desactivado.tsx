import { ReactNode } from 'react';
import HotSessionWatcher from '@/components/session/HotSessionWatcher';
import { getServerSession, Session } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation'; // client component

interface ProtectedLayoutProps {
  children: ReactNode;
}

export default async function ProtectedLayout({ children }: ProtectedLayoutProps) {
  const session: Session | null = await getServerSession(authOptions);
  if (!session?.user) {
    redirect('/api/auth/signin');
  }

  return (
    <>
      <HotSessionWatcher />
      {children}
    </>
  );
}
