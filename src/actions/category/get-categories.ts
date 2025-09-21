'use server';
import prisma from '@/lib/prisma';

export async function getCategories(){
    try {
        return prisma.category.findMany({
            orderBy: {
                name: 'asc'
            }
        });
    } catch (error) {
        console.log(error);
        return [];
    }
}