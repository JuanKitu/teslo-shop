import { Title, InfiniteProductGrid } from '@/components';
import { getPaginatedProductsWithImages, getCategoryBySlug } from '@/actions';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

export const revalidate = 86400;

interface Props {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{
    subcategory?: string; // ← NUEVO
    color?: string;
    size?: string;
    brand?: string;
    brands?: string;
    maxPrice?: string;
  }>;
}

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

export default async function CategoryPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const filters = await searchParams;

  const category = await getCategoryBySlug(slug);

  if (!category) {
    notFound();
  }

  const { products, totalPages } = await getPaginatedProductsWithImages({
    page: 1,
    take: 12,
    categorySlug: slug,
    subcategorySlug: filters.subcategory, // ← NUEVO
    color: filters.color,
    size: filters.size,
    brand: filters.brand || filters.brands,
    maxPrice: filters.maxPrice ? Number(filters.maxPrice) : undefined,
  });

  // Obtener nombre de subcategoría si existe
  const activeSubcategory = category.children?.find((sub) => sub.slug === filters.subcategory);

  return (
    <>
      <Title
        title={category.name}
        subtitle={
          activeSubcategory ? activeSubcategory.name : category.description || 'Todos los productos'
        }
        className="mb-2"
      />
      <InfiniteProductGrid
        initialProducts={products}
        totalPages={totalPages}
        categorySlug={slug}
        searchParams={filters}
      />
    </>
  );
}
