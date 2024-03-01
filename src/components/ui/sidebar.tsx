'use client'
import React from 'react'
import { Nav } from './nav'
import {
    ChevronRight,
    LayoutDashboard,
    Mail,
    ShieldCheck,
    Settings,
    ShieldAlert,
    Cloud,
    ShoppingCart,
    UsersRound,
} from "lucide-react"
import { Button } from './button'

import { useWindowWidth } from '@react-hook/window-size'
import Image from "next/image";
type Props = {}

export default function Sidebar({ }: Props) {
    const [isCollapsed, setIsCollapsed] = React.useState(false)
    const onlyWidth = useWindowWidth()
    const mobileWidth = onlyWidth < 768

    function toggleSidebar() {
        setIsCollapsed(!isCollapsed)
    }

    return (
        <div className='relative min-w-[80px] border-r px-3 pb-10 pt-9'>
            {!mobileWidth &&
                <>
                    { !isCollapsed &&
                        <Image
                            className='pl-2'
                            src="/assets/logoCogel.png"
                            width={100}
                            height={100}
                            alt="Picture of the author"
                        />
                    }
                    <div className='absolute right-[-20px] top-7'>
                        <Button variant='secondary' className='rounded-full p-2' onClick={toggleSidebar}>
                            <ChevronRight />
                        </Button>
                    </div>
                </>
            }
            <div className='pt-2'>
                <Nav
                    isCollapsed={mobileWidth ? true : isCollapsed}
                    links={[
                        {
                            title: "FortiMail",
                            href: "/tools/fortimail",
                            icon: Mail,
                            variant: "default",
                        },
                        {
                            title: "FortiGate",
                            href: "/tools/fortigate",
                            icon: ShieldAlert,
                            variant: "default",
                        },
                        {
                            title: "FortiClient/EMS",
                            href: "/tools/forticlient",
                            icon: ShieldCheck,
                            variant: "default",
                        },
                        {
                            title: "FortiWeb",
                            href: "/tools/fortiweb",
                            icon: Cloud,
                            variant: "default",
                        },
                        {
                            title: "Users",
                            href: "/users",
                            icon: UsersRound,
                            variant: "ghost",
                        },
                        {
                            title: "Orders",
                            href: "/orders",
                            icon: ShoppingCart,
                            variant: "ghost",
                        },
                        {
                            title: "Settings",
                            href: "/settings",
                            icon: Settings,
                            variant: "ghost",
                        },
                    ]}
                />
            </div>
        </div>
    )
}