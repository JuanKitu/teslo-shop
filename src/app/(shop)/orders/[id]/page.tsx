import React from 'react'
import {PaypalButton, Title} from "@/components";
import Image from "next/image";
import {getOrderById} from "@/actions";
import {redirect} from "next/navigation";
import {currencyFormat} from "@/utils";
import CardPayState from "./ui/CardPayState";
interface Props {
    params: Promise<{
        id: string
    }>
}
export default async function orderPage({params}: Props) {
    const {id} = await params;
    const {ok, order} = await getOrderById(id)
    if(!ok || !order){
        redirect("/");
    }
    const address= order.OrderAddress;
    return (
        <div className="flex justify-center items-center mb-72 px-10 sm:px-0">
            <div className="flex flex-col w-[1000px]">
                <Title title={`Orden #${id}`}/>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
                    {/* Carrito */}
                    <div className="flex flex-col mt-5">
                        <CardPayState isPaid={order.isPaid} />
                        {/* Items */}
                        {
                            order.OrderItem.map(item => (
                                <div key={item.product.slug + '-' + item.size} className="flex mb-5">
                                    <Image
                                        src={`/products/${item.product.ProductImage[0].url}`}
                                        alt={item.product.title}
                                        width={100}
                                        style={{
                                            width: '100px',
                                            height: '100px',
                                        }}
                                        height={100}
                                        className="mr-5 rounded"
                                    />
                                    <div>
                                        <p>{item.product.title}</p>
                                        <p>${item.price} x {item.quantity}</p>
                                        <p className="font-bold">Subtotal ${item.price * item.quantity}</p>
                                    </div>
                                </div>
                            ))
                        }
                    </div>


                    {/* Checkout */}
                    <div className="bg-white rounded-xl shadow-xl p-7">
                        <h2 className="text-2xl mb-2 font-bold">Dirección de entrega</h2>
                        <div className="mb-10">
                            <p className="text-xl">{`${address!.firstName} ${address!.lastName}`}</p>
                            <p>{address!.address}</p>
                            <p>{address!.address2}</p>
                            <p>Código postal: {address!.postalCode}</p>
                            <p>{`${address!.city} ${address!.countryId}`}</p>
                            <p>{address!.phone}</p>
                        </div>
                        {/* Divider */}
                        <div className="w-full h-0.5 rounded bg-gray-300 mb-10"></div>

                        <h2 className="text-2xl mb-2">Resumen de orden</h2>
                        <div className="grid grid-cols-2">
                            <span>Nro. Productos</span>
                            <span className="text-right">{order?.itemsInOrder === 1 ?
                                '1 artículo' :
                                `${order?.itemsInOrder} artículos`
                            }</span>

                            <span>Subtotal</span>
                            <span className="text-right">{currencyFormat(order!.subTotal)}</span>

                            <span>Impuestos (%15)</span>
                            <span className="text-right">{currencyFormat(order!.tax)}</span>

                            <span className="mt-5 text-2xl">Total:</span>
                            <span className="mt-5 text-2xl text-right">{currencyFormat(order!.total)}</span>
                        </div>
                        <div className="mt-5 mb-2 w-full">
                            {
                                order.isPaid ? (
                                    <CardPayState isPaid={order.isPaid} />
                                ) : (
                                    <PaypalButton
                                        amount={order!.total}
                                        orderId={order!.id}
                                    />
                                )
                            }
                        </div>


                    </div>

                </div>
            </div>

        </div>
    )
}
