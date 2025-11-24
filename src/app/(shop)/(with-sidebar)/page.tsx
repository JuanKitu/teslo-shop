// app/(shop)/page.tsx
import { Title, InfiniteProductGrid } from '@/components';
import { getPaginatedProductsWithImages } from '@/actions';

export const revalidate = 86400;

interface Props {
  searchParams: Promise<{
    color?: string;
    size?: string;
    brand?: string;
    brands?: string;
    maxPrice?: string;
  }>;
}

export default async function Home({ searchParams }: Props) {
  // ✅ Await searchParams
  const filters = await searchParams;

  const { products, totalPages } = await getPaginatedProductsWithImages({
    page: 1,
    take: 12,
    color: filters.color,
    size: filters.size,
    brand: filters.brand || filters.brands,
    maxPrice: filters.maxPrice ? Number(filters.maxPrice) : undefined,
  });

  return (
    <>
      <Title title="Tienda" subtitle="Todos los productos" className="mb-2" />
      <InfiniteProductGrid
        initialProducts={products}
        totalPages={totalPages}
        searchParams={filters}
      />
    </>
  );
}
