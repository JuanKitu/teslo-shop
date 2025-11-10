'use client';

import React from 'react';
import { IoSearchOutline, IoCloseCircleOutline } from 'react-icons/io5';
import { getSearchBarStyles } from './styles';

interface Props {
  value: string;
  loading: boolean;
  isDark: boolean;
  onChange: (value: string) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onClear: () => void;
  onFocus: () => void;
}

export const SearchInput: React.FC<Props> = ({
  value,
  loading,
  isDark,
  onChange,
  onKeyDown,
  onClear,
  onFocus,
}) => {
  const styles = getSearchBarStyles(isDark);

  return (
    <div className={styles.inputWrapper}>
      {/* Icono de búsqueda */}
      <IoSearchOutline className={styles.iconSearch} />

      {/* Input */}
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={onKeyDown}
        onFocus={onFocus}
        placeholder="Buscar productos..."
        className={styles.input}
        autoComplete="off"
        aria-label="Buscar productos"
      />

      {/* Spinner o botón limpiar */}
      {loading ? (
        <div className={styles.spinner} />
      ) : value.length > 0 ? (
        <button
          onClick={onClear}
          className={styles.iconClear}
          aria-label="Limpiar búsqueda"
          type="button"
        >
          <IoCloseCircleOutline />
        </button>
      ) : null}
    </div>
  );
};
