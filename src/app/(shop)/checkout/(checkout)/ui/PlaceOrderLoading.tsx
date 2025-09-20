import React from 'react'

export default function PlaceOrderLoading() {
    return (
        <div className="bg-white rounded-xl shadow-xl p-7 animate-pulse">
            <h2 className="text-2xl mb-2 font-bold bg-gray-300 rounded w-1/3 h-6"></h2>

            <div className="mb-10 space-y-2">
                <div className="bg-gray-300 rounded w-2/3 h-5"></div>
                <div className="bg-gray-300 rounded w-1/2 h-5"></div>
                <div className="bg-gray-300 rounded w-1/3 h-5"></div>
                <div className="bg-gray-300 rounded w-1/4 h-5"></div>
                <div className="bg-gray-300 rounded w-1/6 h-5"></div>
                <div className="bg-gray-300 rounded w-1/4 h-5"></div>
            </div>

            {/* Divider */}
            <div className="w-full h-0.5 rounded bg-gray-300 mb-10"></div>

            <h2 className="text-2xl mb-2 bg-gray-300 rounded w-1/3 h-6"></h2>

            <div className="grid grid-cols-2 gap-y-3">
                <div className="bg-gray-300 rounded w-1/2 h-5"></div>
                <div className="bg-gray-300 rounded w-1/4 h-5 justify-self-end"></div>

                <div className="bg-gray-300 rounded w-1/2 h-5"></div>
                <div className="bg-gray-300 rounded w-1/4 h-5 justify-self-end"></div>

                <div className="bg-gray-300 rounded w-1/2 h-5"></div>
                <div className="bg-gray-300 rounded w-1/4 h-5 justify-self-end"></div>

                <div className="bg-gray-300 rounded w-1/3 h-7 mt-5"></div>
                <div className="bg-gray-300 rounded w-1/6 h-7 mt-5 justify-self-end"></div>
            </div>

            <div className="mt-5 mb-2 w-full">
                <div className="bg-gray-300 rounded h-10 w-full"></div>
            </div>
        </div>
    )
}
