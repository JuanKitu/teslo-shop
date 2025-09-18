'use client';
import React from 'react'
import {SubmitHandler, useForm} from "react-hook-form";
import {FormInput, FormSelect} from "@/components";
import clsx from "clsx";
import type {Country} from "@/interfaces";
import {useAddressStore} from "@/store";
type FormInputs = {
    firstName: string;
    lastName: string;
    address: string;
    address2: string;
    postalCode:string;
    city: string;
    country: string;
    phone: string;
    state: string;
    rememberAddress: boolean;
}
interface Props {
    countries: Country[];
}
export function AddressForm({countries}: Props) {
    const setAddress = useAddressStore(state => state.setAddress);
    const address = useAddressStore(state => state.address);
    const {handleSubmit, register, formState:{isValid}} = useForm<FormInputs>({
        defaultValues:{
            ...address
        }
    });
    const onSubmit:SubmitHandler<FormInputs> = async (data) => {
        console.log(data);
        setAddress(data);
    }
    return (
        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 gap-2 sm:gap-5 sm:grid-cols-2">


            {/*<div className="flex flex-col mb-2">
                <span>Nombres</span>
                <input
                    type="text"
                    className="p-2 border rounded-md bg-gray-200"
                />
            </div>*/}
            <FormInput
                label="Nombres"
                autoFocus={true}
                className="mb-2"
                registration={register("firstName", { required: "El nombre es requerido" })}
                /*error={errors.name}*/
            />
            <FormInput
                label="Apellidos"
                className="mb-2"
                registration={register("lastName", { required: "El apellido es requerido" })}
                /*error={errors.name}*/
            />
            <FormInput
                label="Dirección"
                className="mb-2"
                registration={register("address", { required: "La Dirección es requerida" })}
                /*error={errors.name}*/
            />
            <FormInput
                label="Dirección 2 (Opcional)"
                className="mb-2"
                registration={register("address2")}
                /*error={errors.name}*/
            />
            <FormInput
                label="Código postal"
                className="mb-2"
                registration={register("postalCode", { required: "El Código postal es requerido" })}
                /*error={errors.name}*/
            />
            <FormInput
                label="Ciudad"
                className="mb-1"
                registration={register("city", { required: "La Ciudad es requerida" })}
                /*error={errors.name}*/
            />
            <FormSelect<Country>
                label="País"
                registration={register("country", { required: "El País es requerido" })}
                options={countries}
                getOptionValue={(c) => c.id}
                getOptionLabel={(c) => c.name}
            />

            <FormInput
                label="Teléfono"
                className="mb-2"
                registration={register("phone", { required: "el Teléfono es requerido" })}
                /*error={errors.name}*/
            />


            <div className="flex flex-col mb-2 sm:mt-1">
                <div className="inline-flex items-center mb-10">
                    <label
                        className="relative flex cursor-pointer items-center rounded-full p-3"
                        htmlFor="checkbox"
                    >
                        <input
                            {...register('rememberAddress')}
                            type="checkbox"
                            className="border-gray-500 before:content[''] peer relative h-5 w-5 cursor-pointer appearance-none rounded-md border border-blue-gray-200 transition-all before:absolute before:top-2/4 before:left-2/4 before:block before:h-12 before:w-12 before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:bg-blue-gray-500 before:opacity-0 before:transition-opacity checked:border-blue-500 checked:bg-blue-500 checked:before:bg-blue-500 hover:before:opacity-10"
                            id="checkbox"
                        />
                        <div
                            className="pointer-events-none absolute top-2/4 left-2/4 -translate-y-2/4 -translate-x-2/4 text-white opacity-0 transition-opacity peer-checked:opacity-100">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-3.5 w-3.5"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                                stroke="currentColor"
                                strokeWidth="1"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                    clipRule="evenodd"
                                ></path>
                            </svg>
                        </div>
                    </label>
                    <span>¿Recordar dirección?</span>
                </div>


                <button
                    type="submit"
                    disabled={!isValid}
                    /*className="btn-primary flex w-full sm:w-1/2 justify-center "*/
                    className={clsx({
                        'btn-primary': isValid,
                        'btn-disabled': !isValid,
                    })}
                >
                    Siguiente
                </button>
            </div>


        </form>
    )
}
