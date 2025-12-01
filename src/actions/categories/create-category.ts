'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

interface CreateCategoryInput {
  name: string;
  description?: string;
  parentId?: string;
  imageUrl?: string;
  isActive?: boolean;
  isFeatured?: boolean;
}

export async function createCategory(data: CreateCategoryInput) {
  try {
    const { name, description, parentId, imageUrl, isActive = true, isFeatured = false } = data;

    // Generate slug
    let slug = generateSlug(name);

    // Ensure slug is unique
    const existingCategory = await prisma.category.findUnique({
      where: { slug },
    });

    if (existingCategory) {
      slug = `${slug}-${Date.now()}`;
    }

    // Get the max order to place new category at the end
    const maxOrder = await prisma.category.findFirst({
      where: { parentId: parentId || null },
      orderBy: { order: 'desc' },
      select: { order: true },
    });

    const newOrder = (maxOrder?.order ?? -1) + 1;

    // Create category
    const category = await prisma.category.create({
      data: {
        name,
        slug,
        description: description || null,
        parentId: parentId || null,
        order: newOrder,
        isActive,
        isFeatured,
        ...(imageUrl && {
          media: {
            create: {
              url: imageUrl,
              type: 'IMAGE',
              isMain: true,
              order: 0,
            },
          },
        }),
      },
      include: {
        media: true,
        _count: {
          select: {
            products: true,
          },
        },
      },
    });

    revalidatePath('/admin/categories');
    revalidatePath('/admin/products');

    return {
      ok: true,
      category,
      message: 'Categoría creada exitosamente',
    };
  } catch (error) {
    console.error('Error creating category:', error);
    return {
      ok: false,
      message: 'Error al crear la categoría',
    };
  }
}
