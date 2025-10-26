import React from 'react';
import clsx from 'clsx';
import { IoReload } from 'react-icons/io5';

interface Props {
  isPending: boolean;
}

export function LoginButton({ isPending }: Props) {
  return (
    <button
      type="submit"
      disabled={isPending}
      className={clsx(
        'flex items-center justify-center gap-2 px-4 py-2 rounded-md transition',
        isPending ? 'btn-disabled' : 'btn-primary'
      )}
    >
      {isPending ? (
        <>
          <IoReload className="h-5 w-5 animate-spin" />
          <span>Cargando...</span>
        </>
      ) : (
        'Ingresar'
      )}
    </button>
  );
}
