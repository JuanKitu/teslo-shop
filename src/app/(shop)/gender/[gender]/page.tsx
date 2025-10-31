import { Title } from '@/components';
import { labelCategory } from '@/interfaces';
import { Gender } from '@prisma/client';
import { getPaginatedProductsWithImages } from '@/actions';
import { notFound } from 'next/navigation';
import { InfiniteProductGrid } from '@/components';

export const revalidate = 86400; // un día

interface Props {
  params: Promise<{ gender: Gender }>;
}

export default async function GenderPage({ params }: Props) {
  const { gender } = await params;

  if (!Object.values(Gender).includes(gender)) {
    notFound();
  }

  const { products, totalPages } = await getPaginatedProductsWithImages({
    page: 1,
    take: 12,
    gender,
  });

  return (
    <>
      <Title
        title={`Artículos de ${labelCategory[gender]}`}
        subtitle="Todos los productos"
        className="mb-2"
      />
      <InfiniteProductGrid initialProducts={products} totalPages={totalPages} gender={gender} />
    </>
  );
}
