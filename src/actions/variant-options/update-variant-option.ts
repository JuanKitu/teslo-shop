'use server';

import prisma from '@/lib/prisma';
import { OptionType } from '@prisma/client';
import { revalidatePath } from 'next/cache';

interface UpdateVariantOptionInput {
  id: string;
  name?: string;
  type?: OptionType;
  description?: string;
  placeholder?: string;
  isRequired?: boolean;
  isFilterable?: boolean;
}

export const updateVariantOption = async (input: UpdateVariantOptionInput) => {
  const { id, name, type, ...rest } = input;

  try {
    // Verificar que la opción existe
    const existing = await prisma.variantOption.findUnique({
      where: { id },
    });

    if (!existing) {
      return {
        ok: false,
        message: 'La opción de variante no existe',
      };
    }

    // Si se cambia el nombre, validar que no exista otra con ese nombre
    if (name && name !== existing.name) {
      const duplicate = await prisma.variantOption.findFirst({
        where: {
          name: {
            equals: name,
            mode: 'insensitive',
          },
          id: {
            not: id,
          },
        },
      });

      if (duplicate) {
        return {
          ok: false,
          message: `Ya existe una opción con el nombre "${name}"`,
        };
      }
    }

    // Preparar datos de actualización
    const updateData: Record<string, unknown> = { ...rest };

    if (name) {
      updateData.name = name;
      // Regenerar slug si cambia el nombre
      updateData.slug = name
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
    }

    if (type) {
      updateData.type = type;
    }

    // Actualizar la opción
    const updated = await prisma.variantOption.update({
      where: { id },
      data: updateData,
      include: {
        globalValues: {
          where: {
            isActive: true,
          },
          orderBy: {
            order: 'asc',
          },
        },
        _count: {
          select: {
            productOptions: true,
            variantValues: true,
            globalValues: true,
          },
        },
      },
    });

    revalidatePath('/admin/attributes');

    return {
      ok: true,
      option: updated,
      message: 'Opción actualizada correctamente',
    };
  } catch (error) {
    console.error('Error updating variant option:', error);
    return {
      ok: false,
      message: 'Error al actualizar la opción de variante',
    };
  }
};
