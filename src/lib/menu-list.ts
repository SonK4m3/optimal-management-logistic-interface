import { LucideIcon, Bot, Car } from 'lucide-react'
type Submenu = {
    href: string
    label: string
    active: boolean
}

type Menu = {
    href: string
    label: string
    active: boolean
    icon: LucideIcon
    submenus: Submenu[]
}

type Group = {
    groupLabel: string
    menus: Menu[]
}

export function getMenuList(pathname: string): Group[] {
    return [
        {
            groupLabel: 'My Logistic features',
            menus: [
                {
                    href: '/orders',
                    label: 'Orders',
                    active: false,
                    icon: Bot,
                    submenus: [
                        {
                            href: '/orders',
                            label: 'List of Orders',
                            active: pathname === '/orders'
                        },
                        {
                            href: '/orders/create',
                            label: 'Create Order',
                            active: pathname === '/orders/create'
                        }
                    ]
                },
                {
                    href: '/vrp',
                    label: 'VRP',
                    active: pathname === '/vrp',
                    icon: Car,
                    submenus: []
                }
            ]
        }
    ]
}
