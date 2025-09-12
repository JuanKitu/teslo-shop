import React from 'react'
import Link from "next/link";
interface Props {
    name: string;
    icon: React.ReactNode;
}
export function SideBarItem({name, icon}: Props) {
    return (
        <Link
            href="/"
            className="flex items-center mt-10 p-2 hover:bg-gray-100 rounded transition-all"
        >
            { icon }
            <span className="ml-3 text-xl">{ name }</span>
        </Link>
    )
}
