import { LucideIcon, Bot, Wallet, LineChart } from 'lucide-react'
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
            groupLabel: 'Trading',
            menus: [
                {
                    href: '/bots',
                    label: 'DCA Bot',
                    active: false,
                    icon: Bot,
                    submenus: [
                        {
                            href: '',
                            label: 'List of Bots',
                            active: pathname === '/bots'
                        },
                        {
                            href: '/bots/create',
                            label: 'Create Bot',
                            active: pathname === '/bots/create'
                        }
                    ]
                },
                {
                    href: '/wallet',
                    label: 'Wallet',
                    active: false,
                    icon: Wallet,
                    submenus: [
                        {
                            href: '/wallet/generate',
                            label: 'Generate Wallet',
                            active: pathname === '/wallet/generate'
                        }
                    ]
                },
                {
                    href: '/technical-analysis',
                    label: 'Technical Analysis',
                    active: pathname === '/technical-analysis',
                    icon: LineChart,
                    submenus: []
                }
            ]
        }
    ]
}
