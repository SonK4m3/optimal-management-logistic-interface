import { LucideIcon, Bot, User, Truck, Home } from 'lucide-react'
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
                    active: pathname.includes('/orders'),
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
                    href: '/admin',
                    label: 'Admin',
                    active: pathname.includes('/admin'),
                    icon: User,
                    submenus: [
                        {
                            href: '/admin',
                            label: 'Dashboard',
                            active: pathname === '/admin'
                        },
                        {
                            href: '/admin/staffs',
                            label: 'List of Staffs',
                            active: pathname === '/admin/staffs'
                        },
                        {
                            href: '/admin/customers',
                            label: 'List of Customers',
                            active: pathname === '/admin/customers'
                        },
                        {
                            href: '/admin/tasks',
                            label: 'List of Tasks',
                            active: pathname === '/admin/tasks'
                        },
                        {
                            href: '/admin/shifts',
                            label: 'List of Shifts',
                            active: pathname === '/admin/shifts'
                        }
                    ]
                },
                {
                    href: '/driver',
                    label: 'Driver',
                    active: pathname === '/driver',
                    icon: Truck,
                    submenus: []
                },
                {
                    href: '/dashboard',
                    label: 'Dashboard',
                    active: pathname === '/dashboard',
                    icon: Home,
                    submenus: []
                },
                {
                    href: '/vehicle',
                    label: 'Vehicle',
                    active: pathname === '/vehicle',
                    icon: Truck,
                    submenus: []
                },
                {
                    href: '/warehouse',
                    label: 'Warehouse',
                    active: pathname === '/warehouse',
                    icon: Truck,
                    submenus: []
                },
                {
                    href: '/booking',
                    label: 'Booking',
                    active: pathname === '/booking',
                    icon: Truck,
                    submenus: []
                },
                {
                    href: '/customer',
                    label: 'Customer',
                    active: pathname === '/customer',
                    icon: Truck,
                    submenus: []
                },
                {
                    href: '/fuel',
                    label: 'Fuel',
                    active: pathname === '/fuel',
                    icon: Truck,
                    submenus: []
                },
                {
                    href: '/tracking',
                    label: 'Tracking',
                    active: pathname === '/tracking',
                    icon: Truck,
                    submenus: []
                },
                {
                    href: '/income-expenses',
                    label: 'Income & Expenses',
                    active: pathname === '/income-expenses',
                    icon: Truck,
                    submenus: []
                }
            ]
        }
    ]
}
