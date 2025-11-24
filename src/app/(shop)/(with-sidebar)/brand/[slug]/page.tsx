import { Title, InfiniteProductGrid } from '@/components';
import { getPaginatedProductsWithImages, getBrandBySlug } from '@/actions';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

export const revalidate = 86400;

interface Props {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{
    color?: string;
    size?: string;
    maxPrice?: string;
  }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const brand = await getBrandBySlug(slug);

  if (!brand) {
    return {
      title: 'Marca no encontrada',
      description: 'La marca que buscas no existe',
    };
  }

  return {
    title: brand.metaTitle || brand.name,
    description: brand.metaDescription || brand.description || undefined,
    keywords: brand.metaKeywords || undefined,
  };
}

export default async function BrandPage({ params, searchParams }: Props) {
  // ✅ Await params y searchParams
  const { slug } = await params;
  const filters = await searchParams;

  const brand = await getBrandBySlug(slug);

  if (!brand) {
    notFound();
  }

  const { products, totalPages } = await getPaginatedProductsWithImages({
    page: 1,
    take: 12,
    brandSlug: slug,
    color: filters.color,
    size: filters.size,
    maxPrice: filters.maxPrice ? Number(filters.maxPrice) : undefined,
  });

  return (
    <>
      <Title
        title={brand.name}
        subtitle={brand.description || 'Todos los productos de esta marca'}
        className="mb-2"
      />
      <InfiniteProductGrid
        initialProducts={products}
        totalPages={totalPages}
        brandSlug={slug}
        searchParams={filters}
      />
    </>
  );
}
