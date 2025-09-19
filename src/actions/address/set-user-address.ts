"use server";
import {Address} from "@/interfaces";
import prisma from "@/lib/prisma";


export async  function setUserAddress(address: Address, userId: string | undefined){
    try {
        if( !userId ){
            return {
                ok: false,
                message: "No se pudo grabar la dirección",
            }
        }
        const newAddress = await createOrReplaceAddress( address, userId );

        return {
            ok: true,
            address: newAddress,
        }

    } catch (error) {
        console.log(error);
        return {
            ok: false,
            message: "No se pudo grabar la dirección",
        };
    }
}

async function createOrReplaceAddress(address: Address, userId: string){
    try {
        const storedAddress = await prisma.userAddress.findUnique({
            where: { userId },
        });

        const addressToSave = {
            userId: userId,
            address: address.address,
            address2: address.address2,
            countryId: address.country,
            city: address.city,
            firstName: address.firstName,
            lastName: address.lastName,
            phone: address.phone,
            postalCode: address.postalCode,
        };

        if (!storedAddress) {
            return await prisma.userAddress.create({
                data: addressToSave,
            });
        }
        return await prisma.userAddress.update({
            where: {userId},
            data: addressToSave
        });
    } catch (error) {
        console.log(error);
        throw new Error("No se pudo grabar la dirección");
    }
}