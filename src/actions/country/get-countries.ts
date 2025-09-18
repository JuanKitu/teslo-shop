'use server';

import prisma from '@/lib/prisma';


export async function getCountries(){
    try {
        return prisma.country.findMany({
            orderBy: {
                name: 'asc'
            }
        });
    } catch (error) {
        console.log(error);
        return [];
    }


}