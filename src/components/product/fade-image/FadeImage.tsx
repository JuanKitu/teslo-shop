"use client";
import React, { useState } from "react";
import { IoTrash } from "react-icons/io5";
import { ProductImage as ProductWithImage } from "@/interfaces";
import { ProductImage } from "@/components";

interface Props {
    img: ProductWithImage;
    productTitle: string;
    onDelete: () => void;
}

export function FadeImage({ img, productTitle, onDelete }: Props) {
    const [isRemoving, setIsRemoving] = useState(false);

    const handleDelete = () => {
        setIsRemoving(true);
        setTimeout(() => {
            onDelete();
        }, 250); // coincide con la animación
    };

    return (
        <div
            className={`relative transition-all duration-300 ${
                isRemoving ? "opacity-0 scale-95" : "opacity-100 scale-100"
            }`}
        >
            <ProductImage
                src={img.url}
                alt={productTitle}
                width={300}
                height={300}
                className="rounded-md shadow-sm"
            />
            <button
                type="button"
                onClick={handleDelete}
                className="absolute bottom-0 left-0 right-0 bg-red-600 text-white text-sm py-1 rounded-b-md hover:bg-red-700 transition"
            >
                <IoTrash className="inline-block w-4 h-4 mr-1" />
                Eliminar
            </button>
        </div>
    );
}
