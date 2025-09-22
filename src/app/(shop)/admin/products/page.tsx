import {Pagination, Title} from '@/components';
import {getPaginatedProductsWithImages} from "@/actions";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import {currencyFormat} from "@/utils";
export const revalidate = 0;
interface Props {
    searchParams: Promise<{
        page: string
    }>
}
export default async function ProductsAdminPage({searchParams}: Props) {
    const findPage = await searchParams;
    const page = findPage.page ? Number(findPage.page) : 1;
    const {products, totalPages} = await getPaginatedProductsWithImages({
        page,
        take: 12,
    });
    return (
        <>
            <Title title="Mantenimiento de productos"/>
            <div className="flex justify-end mb-5">
                <Link href="/admin/products/new" className="btn-primary">
                    Nuevo Producto
                </Link>

            </div>
            <div className="mb-10">
                <table className="min-w-full">
                    <thead className="bg-gray-200 border-b border-gray-300">
                    <tr>
                        <th scope="col" className="text-sm font-medium text-gray-900 px-6 py-4 text-left">
                            Imagen
                        </th>
                        <th scope="col" className="text-sm font-medium text-gray-900 px-6 py-4 text-left">
                            Titulo
                        </th>
                        <th scope="col" className="text-sm font-medium text-gray-900 px-6 py-4 text-left">
                            Precio
                        </th>
                        <th scope="col" className="text-sm font-medium text-gray-900 px-6 py-4 text-left">
                            Género
                        </th>
                        <th scope="col" className="text-sm font-medium text-gray-900 px-6 py-4 text-left">
                            Inventario
                        </th>
                        <th scope="col" className="text-sm font-medium text-gray-900 px-6 py-4 text-left">
                            Tallas
                        </th>
                    </tr>
                    </thead>
                    <tbody>
                    {
                        products.map((product) => (
                            <tr key={product.id} className="bg-white border-b border-gray-300 transition duration-300 ease-in-out hover:bg-gray-100">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    <Link href={`/product/${product.slug}`}>
                                        <Image
                                            src={`/products/${product.ProductImage[0].url}`}
                                            alt={product.title}
                                            width={80}
                                            height={80}
                                            className="w-20 h-20 object-cover rounded"
                                        />
                                    </Link>
                                </td>
                                <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                                    <Link className="hover:underline" href={`/admin/product/${product.slug}`}>
                                        {product.title}
                                    </Link>
                                </td>
                                <td className="text-sm font-bold  text-gray-900 px-6 py-4 whitespace-nowrap">
                                    {currencyFormat(product.price)}
                                </td>
                                <td className="text-sm text-gray-900 px-6 py-4 whitespace-nowrap">
                                    {product.gender}
                                </td>
                                <td className="text-sm font-bold text-gray-900 px-6 py-4 whitespace-nowrap">
                                    {product.inStock}
                                </td>
                                <td className="text-sm font-bold text-gray-900 px-6 py-4 whitespace-nowrap">
                                    {product.sizes.join(', ')}
                                </td>
                            </tr>
                        ))
                    }
                    </tbody>
                </table>
                <Pagination totalPages={totalPages} />
            </div>
        </>
    );
}