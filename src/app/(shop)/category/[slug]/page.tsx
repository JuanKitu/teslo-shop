import { Title } from '@/components';
import { getPaginatedProductsWithImages } from '@/actions';
import { getCategoryBySlug } from '@/actions';
import { notFound } from 'next/navigation';
import { InfiniteProductGrid } from '@/components';
import type { Metadata } from 'next'; // 🆕 Importar tipo

export const revalidate = 86400;

interface Props {
  params: Promise<{ slug: string }>;
}

// 🆕 Agregar tipo de retorno
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);

  if (!category) {
    return {
      title: 'Categoría no encontrada',
      description: 'La categoría que buscas no existe',
    };
  }

  return {
    title: category.metaTitle || category.name,
    description: category.metaDescription || category.description || undefined,
    keywords: category.metaKeywords || undefined,
  };
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;

  // Obtener categoría
  const category = await getCategoryBySlug(slug);

  if (!category) {
    notFound();
  }

  // Obtener productos de la categoría
  const { products, totalPages } = await getPaginatedProductsWithImages({
    page: 1,
    take: 12,
    categorySlug: slug,
  });

  return (
    <>
      <Title
        title={category.name}
        subtitle={category.description || 'Todos los productos'}
        className="mb-2"
      />

      <InfiniteProductGrid initialProducts={products} totalPages={totalPages} categorySlug={slug} />
    </>
  );
}
