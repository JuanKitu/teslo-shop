'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { OptionType } from '@prisma/client';

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

interface CreateVariantOptionInput {
  name: string;
  type: OptionType;
  description?: string;
  placeholder?: string;
  isRequired?: boolean;
  isFilterable?: boolean;
}

export async function createVariantOption(data: CreateVariantOptionInput) {
  try {
    const { name, type, description, placeholder, isRequired = false, isFilterable = true } = data;

    // Generate slug
    let slug = generateSlug(name);

    // Ensure slug is unique
    const existing = await prisma.variantOption.findUnique({
      where: { slug },
    });

    if (existing) {
      slug = `${slug}-${Date.now()}`;
    }

    // Get max position
    const maxPosition = await prisma.variantOption.findFirst({
      orderBy: { position: 'desc' },
      select: { position: true },
    });

    const newPosition = (maxPosition?.position ?? -1) + 1;

    const option = await prisma.variantOption.create({
      data: {
        name,
        slug,
        type,
        description,
        placeholder,
        isRequired,
        isFilterable,
        position: newPosition,
      },
    });

    revalidatePath('/admin/attributes');

    return {
      ok: true,
      option,
      message: 'Opción de variante creada exitosamente',
    };
  } catch (error) {
    console.error('Error creating variant option:', error);
    return {
      ok: false,
      message: 'Error al crear la opción de variante',
    };
  }
}
