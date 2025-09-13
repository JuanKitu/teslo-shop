import React from 'react'
import {initialData} from "@/seed/seed";
import {ProductGrid, Title} from "@/components";
import {labelCategory, Category} from "@/interfaces";
interface Props {
    params: {
        id: Category
    }
}
export default function CategoryPage({params}: Props) {
    const {id} = params;
    const products = initialData.products.filter(product => product.gender === id)

    /*if(id === 'kids'){
        notFound();
    }*/
    return (
        <>
            <Title
                title={`Articulos de ${labelCategory[id]}`}
                subtitle={`Todos los productos`}
                className="mb-2"
            />
            <ProductGrid products={products} />
        </>
    )
}
