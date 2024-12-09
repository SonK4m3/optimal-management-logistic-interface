import { LucideIcon, Bot, User, Truck } from 'lucide-react'
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
                    href: '/',
                    label: 'Customer',
                    active: false,
                    icon: Bot,
                    submenus: [
                        {
                            href: '/orders',
                            label: 'My Orders',
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
                    active: false,
                    icon: User,
                    submenus: [
                        {
                            href: '/admin',
                            label: 'Dashboard',
                            active: pathname === '/admin'
                        },
                        {
                            href: '/admin/staffs',
                            label: 'Manage Staffs',
                            active: pathname === '/admin/staffs'
                        },
                        {
                            href: '/admin/customers',
                            label: 'Manage Customers',
                            active: pathname === '/admin/customers'
                        },
                        {
                            href: '/admin/drivers',
                            label: 'Manage Drivers',
                            active: pathname === '/admin/drivers'
                        },
                        {
                            href: '/admin/tasks',
                            label: 'Manage Tasks',
                            active: pathname === '/admin/tasks'
                        },
                        {
                            href: '/admin/shifts',
                            label: 'Manage Shifts',
                            active: pathname === '/admin/shifts'
                        },
                        {
                            href: '/admin/warehouse',
                            label: 'Manage Warehouses',
                            active: pathname === '/admin/warehouse'
                        },
                        {
                            href: '/admin/products',
                            label: 'Manage Products',
                            active: pathname === '/admin/products'
                        },
                        {
                            href: '/admin/inventory',
                            label: 'Manage Inventory',
                            active: pathname === '/admin/inventory'
                        },
                        {
                            href: '/admin/delivery',
                            label: 'Manage Deliveries',
                            active: pathname === '/admin/delivery'
                        }
                    ]
                },
                {
                    href: '/driver',
                    label: 'Driver',
                    active: pathname === '/driver',
                    icon: Truck,
                    submenus: []
                }
            ]
        }
    ]
}
