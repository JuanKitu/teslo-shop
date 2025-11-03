'use server';

import prisma from '@/lib/prisma';
import bcryptjs from 'bcryptjs';

export async function registerUser(name: string, email: string, password: string) {
  try {
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: bcryptjs.hashSync(password, 10),
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });
    return {
      ok: true,
      user,
      message: 'Usuario registrado exitosamente',
    };
  } catch (error) {
    console.log(error);
    return {
      ok: false,
      user: undefined,
      message: 'Error al registrar el usuario',
    };
  }
}
