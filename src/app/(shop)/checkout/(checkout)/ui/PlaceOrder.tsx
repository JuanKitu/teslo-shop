'use client';
import React, {useEffect, useState} from 'react'
import PlaceOrderLoading from "@/app/(shop)/checkout/(checkout)/ui/PlaceOrderLoading";
import {useAddressStore, useCartStore} from "@/store";
import {useShallow} from "zustand/react/shallow";
import {currencyFormat} from "@/utils";
import {IoWarningOutline} from "react-icons/io5";
import clsx from "clsx";

export function PlaceOrder() {
    const [loaded, setLoaded] = useState(false);
    const [isPlacingOrder, setIsPlacingOrder] = useState(false)
    const address = useAddressStore(state => state.address);
    const {
        itemsInCart,
        subtotal,
        tax,
        total
    } = useCartStore(useShallow(state => state.getSummaryInformation()));
    const cart = useCartStore(state => state.cart);
    useEffect(()=>{
        setLoaded(true);
    }, []);
    const onPlaceOrder = async () => {
        setIsPlacingOrder(true);
        const productOrder = cart.map(product => ({
            productId: product.id,
            quantity: product.quantity,
            size: product.size,
        }));
        console.log(address, productOrder)
        setIsPlacingOrder(false);
    }
    if (!loaded) {
        return (
            <PlaceOrderLoading />
        )
    }
    return (
        <div className="bg-white rounded-xl shadow-xl p-7">
            <h2 className="text-2xl mb-2 font-bold">Dirección de entrega</h2>
            <div className="mb-10">
                <p className="text-xl">{`${address.firstName} ${address.lastName}`}</p>
                <p>{address.address}</p>
                <p>{address.address2}</p>
                <p>Código postal: {address.postalCode}</p>
                <p>{`${address.city} ${address.country}`}</p>
                <p>{address.phone}</p>
            </div>
            {/* Divider */}
            <div className="w-full h-0.5 rounded bg-gray-300 mb-10"></div>

            <h2 className="text-2xl mb-2">Resumen de orden</h2>
            <div className="grid grid-cols-2">
                <span>Nro. Productos</span>
                <span className="text-right">{itemsInCart === 1 ?
                    '1 artículo' :
                    `${itemsInCart} artículos`
                }</span>

                <span>Subtotal</span>
                <span className="text-right">{currencyFormat(subtotal)}</span>

                <span>Impuestos (%15)</span>
                <span className="text-right">{currencyFormat(tax)}</span>

                <span className="mt-5 text-2xl">Total:</span>
                <span className="mt-5 text-2xl text-right">{currencyFormat(total)}</span>
            </div>
            <div className="mt-5 mb-2 w-full">
                <button
                    onClick={onPlaceOrder}
                    disabled={isPlacingOrder}
                    className={
                    clsx(
                        "flex justify-center",
                        {
                            'btn-primary': !isPlacingOrder,
                            'btn-disabled pointer-disabled': isPlacingOrder,
                        }
                     )
                    }
                    /*href="/orders/123"*/ >
                    Colocar orden
                </button>
            </div>
            <div className="mt-4 flex items-center gap-2 rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">
                <IoWarningOutline className="h-5 w-5 shrink-0 text-red-500" />
                <span>Error al crear el pedido. Por favor intenta nuevamente.</span>
            </div>
        </div>
    )
}
