import {Pagination, ProductGrid, Title} from "@/components";
import {getPaginatedProductsWithImages} from "@/actions";
import {redirect} from "next/navigation";
interface Props {
    searchParams: Promise<{
        page: string
    }>
}
export default async function Home({searchParams}: Props) {
    const findPage = await searchParams;
    const page = findPage.page ? Number(findPage.page) : 1;
    const {products, totalPages} = await getPaginatedProductsWithImages({
        page,
        take: 12,
    });
    if(products.length === 0){
        redirect('/')
    }
  return (
    <>
        <Title
        title="Tienda"
        subtitle="Todos los productos"
        className="mb-2"
        />
        <ProductGrid products={products} />
        <Pagination totalPages={totalPages} />
    </>
  );
}
