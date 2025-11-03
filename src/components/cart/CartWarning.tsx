'use client';
import React, { useEffect, useState } from 'react';
import { IoAlertCircle, IoClose } from 'react-icons/io5';

interface Props {
  message: string;
  onClose: () => void;
  className?: string;
}

export function CartWarning({ message, onClose, className }: Props) {
  const [visible, setVisible] = useState(false);
  const [closing, setClosing] = useState(false);

  // 👇 Anima al montar (fade-in)
  useEffect(() => {
    const timeout = setTimeout(() => setVisible(true), 10); // pequeño delay para activar el transition
    return () => clearTimeout(timeout);
  }, []);

  const handleClose = () => {
    setClosing(true);
    setTimeout(() => onClose(), 300); // coincide con duration-300
  };

  return (
    <div
      className={`
        flex items-center justify-between gap-2 mt-2 px-4 py-2 rounded-md shadow-sm border text-amber-900
        bg-amber-50 border-amber-200 transition-all duration-300 ease-in-out
        ${visible && !closing ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-2 scale-95'}
        ${className ?? ''}
      `}
    >
      <div className="flex items-center gap-2">
        <IoAlertCircle className="h-5 w-5 flex-shrink-0" />
        <span className="text-sm">{message}</span>
      </div>
      <button
        onClick={handleClose}
        className="p-1 rounded hover:bg-amber-200/50 transition"
        aria-label="Cerrar alerta"
      >
        <IoClose className="h-4 w-4" />
      </button>
    </div>
  );
}
