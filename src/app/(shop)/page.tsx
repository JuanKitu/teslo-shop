import { Title } from '@/components';
import { getPaginatedProductsWithImages } from '@/actions';
import { InfiniteProductGrid } from '@/components';
export const revalidate = 86400; // 1 día

export default async function Home() {
  const { products, totalPages } = await getPaginatedProductsWithImages({
    page: 1,
    take: 12,
  });
  return (
    <>
      <Title title="Tienda" subtitle="Todos los productos" className="mb-2" />
      <InfiniteProductGrid initialProducts={products} totalPages={totalPages} />
    </>
  );
}
