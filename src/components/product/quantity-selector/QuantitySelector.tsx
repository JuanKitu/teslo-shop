import React from 'react'
import {IoAddCircleOutline, IoRemoveCircleOutline} from "react-icons/io5";
interface Props {
    quantity: number;
    onQuantityChanged: (value: number) => void;
}
export function QuantitySelector({quantity, onQuantityChanged}: Props) {
    const oQuantityChange = (value: number) => {
        const newValue = quantity + value;
        if(newValue < 1 ) return;
        onQuantityChanged(newValue);
    }
    return (
        <div className="flex">
            <button
                onClick={() => oQuantityChange(-1)}
            >
                <IoRemoveCircleOutline className="cursor-pointer" size={30}/>
            </button>
            <span className="w-20 mx-3 px-5 bg-gray-200 text-center rounded">{quantity}</span>
            <button
                onClick={() => oQuantityChange(1)}
            >
                <IoAddCircleOutline className="cursor-pointer" size={30}/>
            </button>
        </div>
    )
}
