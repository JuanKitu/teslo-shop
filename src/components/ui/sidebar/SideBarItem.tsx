'use client'
import React from 'react'
import Link from "next/link";
import {useUiStore} from "@/store";
interface Props {
    name: string;
    urlPath?: string;
    onClick?: () => void;
    icon: React.ReactNode;
}
export function SideBarItem({name, icon, urlPath, onClick}: Props) {
    const closeMenu = useUiStore(state => state.closeSideMenu);
    return (
        <Link
            onClick={() => {
                onClick?.();
                closeMenu();
            }}
            href={urlPath ?? '/'}
            className="flex items-center mt-10 p-2 hover:bg-gray-100 rounded transition-all"
        >
            { icon }
            <span className="ml-3 text-xl">{ name }</span>
        </Link>
    )
}
