'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { SubmitHandler, useForm } from 'react-hook-form';
import { registerUser, login } from '@/actions';
import { IoAlertCircle } from 'react-icons/io5';
import { FormInput } from '@/components';
type FormInputs = {
  name: string;
  email: string;
  password: string;
};
export default function RegisterForm() {
  const [errorMessage, setErrorMessage] = useState('');
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormInputs>();
  const onSubmit: SubmitHandler<FormInputs> = async (data) => {
    const { name, email, password } = data;
    const response = await registerUser(name, email, password);
    if (!response.ok) {
      setErrorMessage(response.message);
      return;
    }
    await login(email.toLowerCase(), password);
    window.location.replace('/');
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
      <FormInput
        label="Nombre completo"
        className="mb-4"
        registration={register('name', { required: 'El nombre es requerido' })}
        error={errors.name}
      />

      <FormInput
        label="Correo electrónico"
        type="email"
        className="mb-4"
        classNameInput="px-5 py-2 rounded"
        registration={register('email', {
          required: 'El email es requerido',
          pattern: {
            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/i,
            message: 'Formato de email inválido',
          },
        })}
        error={errors.email}
      />

      <FormInput
        label="Contraseña"
        className="mb-4"
        classNameInput="px-5 py-2 rounded"
        type="password"
        registration={register('password', { required: 'La contraseña es requerida' })}
        error={errors.password}
      />

      <button className="btn-primary">Crear cuenta</button>

      {errorMessage && (
        <div
          className="mt-4 rounded-lg bg-red-100 p-3 text-sm text-red-700 flex items-center gap-2 fade-in"
          aria-live="polite"
          aria-atomic="true"
        >
          <IoAlertCircle className="h-5 w-5 flex-shrink-0 text-red-500" />
          <span>{errorMessage ?? 'Ocurrió un error al registrarse'}</span>
        </div>
      )}

      {/* divisor l ine */}
      <div className="flex items-center my-5">
        <div className="flex-1 border-t border-gray-500"></div>
        <div className="px-2 text-gray-800">O</div>
        <div className="flex-1 border-t border-gray-500"></div>
      </div>

      <Link href="/auth/login" className="btn-secondary text-center">
        Ingresar
      </Link>
    </form>
  );
}
