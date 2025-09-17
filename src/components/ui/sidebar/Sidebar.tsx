'use client'
import React from 'react'
import {
    IoCloseOutline,
    IoLogInOutline,
    IoLogOutOutline,
    IoPeopleOutline,
    IoPersonOutline,
    IoSearchOutline,
    IoShirtOutline,
    IoTicketOutline
} from "react-icons/io5";
import {SideBarItem} from "@/components";
import {useUiStore} from "@/store";
import clsx from "clsx";
import {logout} from "@/actions";
const itemsAdminMenu = [
    {
        name: "Perfil",
        urlPath: "/profile",
        icon: <IoPersonOutline size={30} />
    },
    {
        name: "Ordenes",
        icon: <IoTicketOutline size={30} />
    },
    {
        name: "Ingresar",
        icon: <IoLogInOutline size={30} />
    },
    {
        name: "Salir",
        icon: <IoLogOutOutline size={30} />,
        callback: ()=>{
            logout().then()
        }
    },
]
const itemsUserMenu = [
    {
        name: "Productos",
        icon: <IoShirtOutline size={30} />
    },
    {
        name: "Ordenes",
        icon: <IoTicketOutline size={30} />
    },
    {
        name: "Usuarios",
        icon: <IoPeopleOutline size={30} />
    },
]
export function Sidebar() {
    const isSideMenuOpen = useUiStore(state => state.isSideMenuOpen);
    const closeMenu = useUiStore(state => state.closeSideMenu);
    return (
        <div>
            {/* Background black */}
            {
                isSideMenuOpen && (
                    <div className="fixed top-0 left-0 w-screen h-screen z-10 bg-black opacity-30" onClick={()=>closeMenu()} />
                )
            }
            {/* Blur */}
            {
                isSideMenuOpen && (
                    <div
                        onClick={()=>closeMenu()}
                        className="fixed top-0 left-0 w-screen h-screen z-10 backdrop-filter backdrop-blur-sm" />
                )
            }
            {/* SideMenu */}
            <nav className={
                clsx(
                    "fixed p-5 right-0 top-0 w-[500px] h-screen bg-white z-20 shadow-2xl transform transition-all duration-300",
                    {
                        "translate-x-full": !isSideMenuOpen,
                    }
                )
            }>
                <IoCloseOutline
                    size={50}
                    onClick={()=>closeMenu()}
                    className="absolute top-5 right-5 cursor-pointer" />
                {/* Input */}
                <div className="relative mt-14">
                    <IoSearchOutline size={20} className="absolute top-2 left-2" />
                    <input
                        type="text"
                        placeholder="Buscar"
                        className="w-full bg-gray-50 pl-10 py-1 pr-10 border-b-2 text-xl border-gray-200 focus:outline-none focus:border-blue-500" />
                </div>
                {/* Menú */}
                {
                    itemsAdminMenu.map(item => (
                        <SideBarItem
                            key={item.name}
                            name={item.name}
                            icon={item.icon}
                            onClick={item.callback}
                            urlPath={item.urlPath}
                        />
                    ))
                }
                {/* Line separator */}
                <div className="h-px w-full bg-gray-400 my-10" />
                {
                    itemsUserMenu.map(item => (
                        <SideBarItem key={item.name} name={item.name} icon={item.icon} />
                    ))
                }
            </nav>
        </div>
    )
}
