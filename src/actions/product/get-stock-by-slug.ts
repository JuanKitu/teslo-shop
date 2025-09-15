'use server';

import prisma from '@/lib/prisma';
// import { sleep } from '@/utils';


export async function getStockBySlug( slug: string ): Promise<number>{
    try {
        const stock = await prisma.product.findFirst({
            where: { slug },
            select: { inStock: true }
        });
        return stock?.inStock ?? 0;
    } catch (error) {
        void error;
        return 0;
    }


}