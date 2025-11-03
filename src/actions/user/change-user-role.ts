'use server';
import { getServerSession, Session } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function changeUserRole(userId: string, role: string) {
  const session: Session | null = await getServerSession(authOptions);

  if (session?.user?.role !== 'admin') {
    return {
      ok: false,
      message: 'Debe de estar autenticado como admin',
    };
  }
  try {
    const newRole = role === 'admin' ? 'admin' : 'user';
    await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        role: newRole,
      },
    });
    revalidatePath('/admin/users');
    return {
      ok: true,
    };
  } catch (error) {
    console.log(error);
    return {
      ok: false,
      message: 'No se pudo actualizar el role, revisar logs',
    };
  }
}
