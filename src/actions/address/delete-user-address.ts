'use server';
import prisma from '@/lib/prisma';

export async function deleteUserAddress( userId: string ) {
    try {
        await prisma.userAddress.delete({
            where: { userId }
        });
        return { ok: true };

    } catch (error) {
        console.log(error);

        return {
            ok: false,
            message: 'No se pudo eliminar la direccion'
        }
    }
}