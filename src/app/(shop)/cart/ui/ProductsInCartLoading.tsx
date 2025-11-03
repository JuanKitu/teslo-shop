import React from 'react';

export function ProductsInCartLoading() {
  return (
    <div className="flex mb-5 animate-pulse">
      {/* Imagen simulada */}
      <div className="w-[100px] h-[100px] bg-gray-300 rounded mr-5"></div>

      {/* Texto + botones simulados */}
      <div className="flex-1">
        {/* Título */}
        <div className="h-4 bg-gray-300 rounded w-3/4 mb-3"></div>
        {/* Precio */}
        <div className="h-4 bg-gray-300 rounded w-1/4 mb-3"></div>
        {/* Selector cantidad */}
        <div className="h-8 bg-gray-300 rounded w-32 mb-3"></div>
        {/* Botón remover */}
        <div className="h-4 bg-gray-300 rounded w-20"></div>
      </div>
    </div>
  );
}
