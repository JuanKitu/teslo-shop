'use client'
import React, {useState} from 'react'
import {IoAddCircleOutline, IoRemoveCircleOutline} from "react-icons/io5";
interface Props {
    quantity: number;
}
export function QuantitySelector({quantity}: Props) {
    const [count, setCount] = useState( quantity );
    const oQuantityChange = (value: number) => {
        if(count + value < 1 ) return;
        setCount(count + value);
    }
    return (
        <div className="flex">
            <button
                onClick={() => oQuantityChange(-1)}
            >
                <IoRemoveCircleOutline size={30}/>
            </button>
            <span className="w-20 mx-3 px-5 bg-gray-200 text-center rounded">{count}</span>
            <button
                onClick={() => oQuantityChange(1)}
            >
                <IoAddCircleOutline size={30}/>
            </button>
        </div>
    )
}
