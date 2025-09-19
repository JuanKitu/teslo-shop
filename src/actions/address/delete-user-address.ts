'use server';
import prisma from '@/lib/prisma';

export async function deleteUserAddress( userId: string | undefined ) {
    try {
        if( !userId ){
            return {
                ok: false,
                message: "No se pudo grabar la dirección",
            }
        }
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