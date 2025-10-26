'use server';

import prisma from '@/lib/prisma';
import { v2 as cloudinary } from 'cloudinary';
import { revalidatePath } from 'next/cache';

cloudinary.config(process.env.CLOUDINARY_URL ?? '');

export async function deleteProductImage(imageUrl: string) {
  if (!imageUrl.startsWith('http')) {
    return { ok: false, error: 'No se pueden borrar imágenes locales (FS)' };
  }

  const imageName = imageUrl.split('/').pop()?.split('.')[0] ?? '';

  try {
    // 1️⃣ Eliminar de Cloudinary
    await cloudinary.uploader.destroy(imageName);

    // 2️⃣ Intentar borrar de la DB si existe
    const deletedImage = await prisma.productImage.deleteMany({
      where: { url: imageUrl },
    });

    // 3️⃣ Opcional: si querés revalidar todos el panel de productos
    revalidatePath('/admin/products');

    return { ok: true, deleted: deletedImage.count };
  } catch (error) {
    console.error('[deleteProductImage]', error);
    return { ok: false, message: 'No se pudo eliminar la imagen' };
  }
}
