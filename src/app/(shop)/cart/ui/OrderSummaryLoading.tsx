import React from 'react';

export function OrderSummaryLoading() {
  return (
    <>
      <div className="animate-pulse">
        {/* Título */}
        <div className="h-6 bg-gray-300 rounded w-40 mb-4"></div>

        {/* Grid resumen */}
        <div className="grid grid-cols-2 gap-y-3">
          {/* Nro Productos */}
          <div className="h-4 bg-gray-300 rounded w-28"></div>
          <div className="h-4 bg-gray-300 rounded w-20 justify-self-end"></div>

          {/* Subtotal */}
          <div className="h-4 bg-gray-300 rounded w-20"></div>
          <div className="h-4 bg-gray-300 rounded w-16 justify-self-end"></div>

          {/* Impuestos */}
          <div className="h-4 bg-gray-300 rounded w-32"></div>
          <div className="h-4 bg-gray-300 rounded w-16 justify-self-end"></div>

          {/* Total */}
          <div className="h-6 bg-gray-300 rounded w-24 mt-5"></div>
          <div className="h-6 bg-gray-300 rounded w-20 justify-self-end mt-5"></div>
        </div>

        {/* Botón */}
        <div className="mt-6 w-full h-10 bg-gray-300 rounded"></div>
      </div>
    </>
  );
}
