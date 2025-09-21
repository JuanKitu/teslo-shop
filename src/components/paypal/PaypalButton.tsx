'use client';
import React from 'react'
import {PayPalButtons, usePayPalScriptReducer} from "@paypal/react-paypal-js";
import type {
    CreateOrderActions,
    CreateOrderData,
    PayPalButtonCreateOrder,
    PayPalButtonOnApprove,
    OnApproveActions,
    OnApproveData
} from "@paypal/paypal-js";
import {setTransactionId} from "@/actions";
import {paypalCheckPayment} from "@/actions/payments/paypal-check-payment";
interface Props {
    orderId: string;
    amount: number;
}
export function PaypalButton({orderId, amount}: Props) {
    const [{ isPending }] = usePayPalScriptReducer();
    if(isPending) return (
        <div className="animate-pulse mb-16">
            <div className="h-11 bg-gray-300 rounded"></div>
            <div className="h-11 bg-gray-300 rounded mt-2"></div>

        </div>
    )
    const roundAmount = (Math.round(amount * 100)/100).toFixed(2);
    const createOrder: PayPalButtonCreateOrder = async (data: CreateOrderData, actions: CreateOrderActions):Promise<string> => {
        const transactionId = await actions.order.create({
            intent: 'CAPTURE',
            purchase_units: [
                {
                    invoice_id: orderId,
                    amount: {
                        value: `${roundAmount}`,
                        currency_code: 'USD'
                    }
                }
            ]
        });
        const isSetTransaction = await setTransactionId(orderId, transactionId);
        if(!isSetTransaction.ok) throw new Error('Error setting transaction id');
        return transactionId;
    }
    const onApprove: PayPalButtonOnApprove = async (
        data: OnApproveData,
        actions: OnApproveActions
    ):Promise<void> => {
        const details = await actions.order?.capture();
        if(!details || !details?.id) return;
        await paypalCheckPayment(details.id)
    }
    return (
        <div className="relative z-0">
            <PayPalButtons
                createOrder={createOrder}
                onApprove={onApprove}
            />
        </div>
    )
}
