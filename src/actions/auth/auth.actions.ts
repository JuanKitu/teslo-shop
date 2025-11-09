'use server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { getServerSession } from 'next-auth';
import type { Session } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
export async function getUserServerSession() {
  const session: Session | null = await getServerSession(authOptions);
  return session?.user;
}
export async function signInEmailPassword(email: string, password: string) {
  if (!email || !password) return null;
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });
  if (!user) return createUser(email, password);
  if (!bcrypt.compareSync(password, user.password ?? '')) return null;
  return user;
}

export async function createUser(email: string, password: string) {
  return prisma.user.create({
    data: {
      email,
      password: bcrypt.hashSync(password, 10),
      name: email.split('@')[0],
    },
  });
}
