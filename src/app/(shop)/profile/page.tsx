import React from 'react';
import { Title } from '@/components';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import type { Session } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export default async function ProfilePage() {
  const session: Session | null = await getServerSession(authOptions);
  if (!session?.user) {
    redirect('/');
  }

  return (
    <div>
      <Title title="Perfil" />
      <pre>{JSON.stringify(session.user, null, 2)}</pre>
    </div>
  );
}
