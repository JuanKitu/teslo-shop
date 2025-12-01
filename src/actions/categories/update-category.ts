'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

interface UpdateCategoryInput {
  id: string;
  name?: string;
  description?: string;
  parentId?: string;
  imageUrl?: string;
  isActive?: boolean;
  isFeatured?: boolean;
  isHidden?: boolean;
}

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export async function updateCategory(data: UpdateCategoryInput) {
  try {
    const { id, name, description, parentId, imageUrl, isActive, isFeatured, isHidden } = data;

    // Check if category exists
    const existingCategory = await prisma.category.findUnique({
      where: { id },
      include: { media: true },
    });

    if (!existingCategory) {
      return {
        ok: false,
        message: 'Categoría no encontrada',
      };
    }

    // Prevent setting parent to itself or its children
    if (parentId && parentId === id) {
      return {
        ok: false,
        message: 'Una categoría no puede ser padre de sí misma',
      };
    }

    const updateData: Record<string, unknown> = {};

    // Update slug if name changed
    if (name && name !== existingCategory.name) {
      let newSlug = generateSlug(name);

      // Check if slug is taken by another category
      const slugExists = await prisma.category.findFirst({
        where: {
          slug: newSlug,
          id: { not: id },
        },
      });

      if (slugExists) {
        newSlug = `${newSlug}-${Date.now()}`;
      }

      updateData.name = name;
      updateData.slug = newSlug;
    }

    if (description !== undefined) updateData.description = description || null;
    if (parentId !== undefined) updateData.parentId = parentId || null;
    if (isActive !== undefined) updateData.isActive = isActive;
    if (isFeatured !== undefined) updateData.isFeatured = isFeatured;
    if (isHidden !== undefined) updateData.isHidden = isHidden;

    // Handle image update
    if (imageUrl) {
      // Delete old main image if exists
      const mainImage = existingCategory.media.find((m) => m.isMain);
      if (mainImage) {
        await prisma.categoryMedia.delete({
          where: { id: mainImage.id },
        });
      }

      // Create new main image
      updateData.media = {
        create: {
          url: imageUrl,
          type: 'IMAGE',
          isMain: true,
          order: 0,
        },
      };
    }

    const category = await prisma.category.update({
      where: { id },
      data: updateData,
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
      message: 'Categoría actualizada exitosamente',
    };
  } catch (error) {
    console.error('Error updating category:', error);
    return {
      ok: false,
      message: 'Error al actualizar la categoría',
    };
  }
}
