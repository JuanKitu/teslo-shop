import React from 'react';
import { IoAlertCircle } from 'react-icons/io5';
interface Props {
  message: string;
}
export default function AlertText({ message }: Props) {
  return (
    <div className="flex items-center gap-2 text-red-500 mb-2 fade-in">
      <IoAlertCircle className="h-5 w-5 flex-shrink-0" />
      <span>{message}</span>
    </div>
  );
}
