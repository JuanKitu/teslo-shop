"use client";

import type {Category, Gender, Product} from "@/interfaces";
import {SubmitHandler, useForm} from "react-hook-form";
import {FormInput, FormSelect, FormTextArea} from "@/components";
import React from "react";
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
interface Props {
    product: Product;
    categories: Category[];
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

const sizes = ["XS", "S", "M", "L", "XL", "XXL"];

export const ProductForm = ({ product, categories }: Props) => {

    const {
        handleSubmit,
        register,
        formState: { isValid },
    } = useForm<FormInputs>({
        defaultValues:{
            ...product,
            tags:product.tags.join(', '),
            sizes: product.sizes ?? []
        }
        });
    const onSubmit:SubmitHandler<FormInputs> = async (data)=>{
        console.log(data)
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
                    /*error={errors.name}*/
                />
                <FormInput
                    label="Slug"
                    classNameInput="p-2 rounded-md"
                    className="mb-2"
                    registration={register("slug", { required: "El slug es requerido" })}
                    /*error={errors.name}*/
                />
                <FormTextArea
                    label="Descripción"
                    classNameInput="p-2 rounded-md"
                    className="mb-2"
                    rows={5}
                    registration={register("description", { required: "La descripción es requerida" })}
                />
                <FormInput
                    label="Precio"
                    classNameInput="p-2 rounded-md"
                    className="mb-2"
                    type="number"
                    registration={register("price", { required: "El precio es requerido", min: 0 })}
                    /*error={errors.name}*/
                />
                <FormInput
                    label="Tags"
                    classNameInput="p-2 rounded-md"
                    className="mb-2"
                    registration={register("tags", { required: "Los tags son requeridos" })}
                    /*error={errors.name}*/
                />
                <FormSelect<Gender>
                    label="Género"
                    classNameSelect="p-2 rounded-md"
                    className="mb-2"
                    registration={register("gender", { required: "El género es requerido" })}
                    options={genders}
                    getOptionValue={(c) => c.id}
                    getOptionLabel={(c) => c.name}
                />
                <FormSelect<Category>
                    label="Categoria"
                    classNameSelect="p-2 rounded-md"
                    className="mb-2"
                    registration={register("categoryId", { required: "La categoria es requerida" })}
                    options={categories}
                    getOptionValue={(c) => c.id}
                    getOptionLabel={(c) => c.name}
                />
                <button className="btn-primary w-full">
                    Guardar
                </button>
            </div>
            {/* Selector de tallas y fotos */}
            <div className="w-full">
                {/* As checkboxes */}
                <div className="flex flex-col">

                    <span>Tallas</span>
                    <div className="flex flex-wrap">

                        {
                            sizes.map( size => (
                                // bg-blue-500 text-white <--- si está seleccionado
                                <div key={ size } className="flex  items-center justify-center w-10 h-10 mr-2 border rounded-md">
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

                </div>
            </div>
        </form>
    );
};
