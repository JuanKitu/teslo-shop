"use client";

import type {Category, Gender, Product, ProductImage} from "@/interfaces";
import Image from "next/image";
import {SubmitHandler, useForm} from "react-hook-form";
import {FormInput, FormSelect, FormTextArea} from "@/components";
import React, {useState} from "react";
import clsx from "clsx";
import {createUpdateProduct} from "@/actions";
import {useRouter} from "next/navigation";
import {IoAlertCircle} from "react-icons/io5";
interface FormInputs {
    title: string;
    slug: string;
    description: string;
    price: number;
    inStock: number;
    sizes: string[];
    tags: string;
    gender: 'men' | 'women' | 'kid' | 'unisex';
    categoryId: string;
}
const genders: Gender[] = [
    {
        id: "men",
        name: "Hombre",
    },
    {
        id: "women",
        name: "Mujer",
    },
    {
        id: "kid",
        name: "Niño",
    },
    {
        id: "unisex",
        name: "Unisex",
    },
];
interface Props {
    product:Partial<Product> & {
        ProductImage?: ProductImage[];
    };
    categories: Category[];
}
const sizes = ["XS", "S", "M", "L", "XL", "XXL"];

export const ProductForm = ({ product, categories }: Props) => {
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const router = useRouter();
    const {
        handleSubmit,
        register,
        getValues,
        setValue,
        watch,
        formState: { isValid, errors },
    } = useForm<FormInputs>({
        defaultValues:{
            ...product,
            tags: product.tags?.join(', '),
            sizes: product.sizes ?? []
        }
        });
    watch('sizes');
    const onSubmit:SubmitHandler<FormInputs> = async (data)=>{
        setErrorMessage(null);
        const formData = new FormData();
        const {...productToSave} = data;
        if(product.id){
            formData.append('id', product.id);
        }
        formData.append('title', productToSave.title);
        formData.append('slug', productToSave.slug);
        formData.append('description', productToSave.description);
        formData.append('price', productToSave.price.toString());
        formData.append('inStock', productToSave.inStock.toString());
        formData.append('sizes', productToSave.sizes.join(','));
        formData.append('tags', productToSave.tags);
        formData.append('gender', productToSave.gender);
        formData.append('categoryId', productToSave.categoryId);
        const {ok, product: updateProduct} = await createUpdateProduct(formData);
        if(!ok){
            setErrorMessage("No se pudo guardar el producto. Intenta nuevamente.");
            return;
        }
        router.replace(`/admin/product/${updateProduct?.slug}`);
    }
    const onSizeChange = (size: string) => {
        const sizes = new Set(getValues('sizes'));
        if (sizes.has(size)) {
            sizes.delete(size);
        } else {
            sizes.add(size);
        }
        return setValue('sizes', Array.from(sizes))
    }
    return (
        <form onSubmit={handleSubmit(onSubmit)} className="grid px-5 mb-16 grid-cols-1 sm:px-0 sm:grid-cols-2 gap-3">
            {/* Textos */}
            <div className="w-full">
                <FormInput
                    label="Título"
                    autoFocus
                    classNameInput="p-2 rounded-md"
                    className="mb-2"
                    registration={register("title", { required: "El título es requerido" })}
                    error={errors.title}
                />
                <FormInput
                    label="Slug"
                    classNameInput="p-2 rounded-md"
                    className="mb-2"
                    registration={register("slug", { required: "El slug es requerido" })}
                    error={errors.slug}
                />
                <FormTextArea
                    label="Descripción"
                    classNameInput="p-2 rounded-md"
                    className="mb-2"
                    rows={5}
                    error={errors.description}
                    registration={register("description", { required: "La descripción es requerida" })}
                />
                <FormInput
                    label="Precio"
                    classNameInput="p-2 rounded-md"
                    className="mb-2"
                    type="number"
                    registration={register("price", { required: "El precio es requerido", min: 0 })}
                    error={errors.price}
                />
                <FormInput
                    label="Tags"
                    classNameInput="p-2 rounded-md"
                    className="mb-2"
                    registration={register("tags", { required: "Los tags son requeridos" })}
                    error={errors.tags}
                />
                <FormSelect<Gender>
                    label="Género"
                    classNameSelect="p-2 rounded-md"
                    className="mb-2"
                    registration={register("gender", { required: "El género es requerido" })}
                    options={genders}
                    error={errors.gender}
                    getOptionValue={(c) => c.id}
                    getOptionLabel={(c) => c.name}
                />
                <FormSelect<Category>
                    label="Categoria"
                    classNameSelect="p-2 rounded-md"
                    className="mb-2"
                    registration={register("categoryId", { required: "La categoria es requerida" })}
                    options={categories}
                    error={errors.categoryId}
                    getOptionValue={(c) => c.id}
                    getOptionLabel={(c) => c.name}
                />
                <button className={
                    clsx(
                        "w-full",
                        {
                            'btn-disabled': !isValid,
                            'btn-primary': isValid,
                        }
                    )
                }>
                    Guardar
                </button>
                {errorMessage && (
                    <div
                        className="mt-4 rounded-lg bg-red-100 p-3 text-sm text-red-700 flex items-center gap-2 fade-in"
                        aria-live="polite"
                        aria-atomic="true"
                    >
                        <IoAlertCircle className="h-5 w-5 flex-shrink-0 text-red-500" />
                        <span>{errorMessage}</span>
                    </div>
                )}
            </div>
            {/* Selector de tallas y fotos */}
            <div className="w-full">
                <FormInput
                    label="Inventario"
                    classNameInput="p-2 rounded-md"
                    className="mb-2"
                    type="number"
                    registration={register("inStock", { required: "El inventario es requerido", min: 0 })}
                    /*error={errors.name}*/
                />
                {/* As checkboxes */}
                <div className="flex flex-col">

                    <span>Tallas</span>
                    <div className="flex flex-wrap">

                        {
                            sizes.map( size => (
                                // bg-blue-500 text-white <--- si está seleccionado
                                <div key={ size }
                                     onClick={()=>{onSizeChange(size)}}
                                     className={
                                    clsx(
                                        "p-2 border cursor-pointer rounded-md mr-2 mb-2 w-14 transition-all text-center",
                                        {
                                            'bg-blue-500 text-white': getValues('sizes').includes(size)
                                        }
                                    )
                                     }
                                >
                                    <span>{ size }</span>
                                </div>
                            ))
                        }

                    </div>


                    <div className="flex flex-col mb-2">

                        <span>Fotos</span>
                        <input
                            type="file"
                            multiple
                            className="p-2 border rounded-md bg-gray-200"
                            accept="image/png, image/jpeg"
                        />

                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {
                            product.ProductImage?.map( image => (
                                <div key={ image.id } className="relative">
                                    <Image
                                        src={`/products/${image.url}`}
                                        alt={product.title ?? ''}
                                        width={300}
                                        height={300}
                                        className="rounded-t-xl shadow-md"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => console.log('Eliminar imagen', image.id, image.url)}
                                        className="btn-danger rounded-b-xl w-full">
                                        Eliminar
                                    </button>
                                </div>
                            ))
                        }
                    </div>
                </div>
            </div>
        </form>
    );
};
