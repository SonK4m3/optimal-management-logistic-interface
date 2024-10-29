import React, { useEffect, useRef, useState } from 'react'
import { clsx } from 'clsx'
import useThrottle from '@/hooks/useThrottle.ts'

import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuList
} from '@/components/ui/navigation-menu.tsx'
import { Archive, CircleUser, History, Sparkles } from 'lucide-react'
import { useLocation, useNavigate } from 'react-router-dom'
import { IconSet } from '@/components/IconSet.tsx'

type BarItem = {
    icon: (color: string) => JSX.Element
    name: string
    href: string
}

const TabBarItem: React.FC<BarItem> = ({ icon, name, href }) => {
    const location = useLocation()
    const isActive = href === location.pathname
    const navigate = useNavigate()

    return (
        <NavigationMenuItem className='flex-1 grow cursor-pointer my-auto'>
            <div
                onClick={() => navigate(href)}
                className='flex flex-col w-full items-center px-1 py-0 relative'
            >
                <IconSet
                    BG={false}
                    badge={false}
                    icon={icon(isActive ? 'white' : '#FFFFFF80')}
                    size='twenty'
                />
                {isActive && (
                    <>
                        <div className='relative self-stretch font-small-regular-12 font-[number:var(--small-regular-12-font-weight)] text-variable-collection-neutral-900-duplicate text-[length:var(--small-regular-12-font-size)] text-center tracking-[var(--small-regular-12-letter-spacing)] leading-[var(--small-regular-12-line-height)] [font-style:var(--small-regular-12-font-style)]'>
                            {name}
                        </div>
                        <div className='absolute w-[35px] h-[18px] top-2.5 left-[50%] transform -translate-x-1/2 bg-[#dffe0f] rounded-[9px] blur-[22.4px] opacity-100' />
                        <div className='absolute w-8 h-[4px] top-[45px] left-[50%] transform -translate-x-1/2 bg-brand-400 rounded-t-full' />
                    </>
                )}
            </div>
        </NavigationMenuItem>
    )
}

const BottomTabBar: React.FC = () => {
    const [isVisible, setIsVisible] = useState(true)
    const lastScrollTop = useRef<number>(0)

    const handleScroll = useThrottle(() => {
        const currentScrollTop = window.scrollY
        setIsVisible(currentScrollTop <= lastScrollTop.current)
        lastScrollTop.current = currentScrollTop
    }, 100)

    useEffect(() => {
        window.addEventListener('scroll', handleScroll, { passive: false })

        return () => {
            window.removeEventListener('scroll', handleScroll)
        }
    }, [handleScroll])

    return (
        <div
            className={clsx(
                'fixed bottom-0 left-0 w-full h-auto transition-transform duration-300',
                {
                    'transform translate-y-full': !isVisible,
                    'transform translate-y-0': isVisible
                }
            )}
        >
            <NavigationMenu
                className={clsx(
                    'relative z-10 w-full items-center bg-white [background:linear-gradient(180deg,rgba(7,7,12,0)_0%,rgb(7,7,12)_20.5%)]'
                )}
            >
                <NavigationMenuList
                    className={clsx(
                        'flex items-start px-4 py-3 self-stretch w-full flex-[0_0_auto] backdrop-blur-lg backdrop-brightness-[100%] [-webkit-backdrop-filter:blur(16px)_brightness(100%)]'
                    )}
                >
                    <TabBarItem
                        icon={color => <Sparkles className='!relative !w-5 !h-5' color={color} />}
                        href='/home'
                        name='Discover'
                    />
                    <TabBarItem
                        icon={color => <Archive className='!relative !w-5 !h-5' color={color} />}
                        href='/portfolio'
                        name='Portfolio'
                    />
                    <TabBarItem
                        icon={color => <History className='!relative !w-5 !h-5' color={color} />}
                        href={'/activities'}
                        name='Activities'
                    />
                    <TabBarItem
                        icon={color => <CircleUser className='!relative !w-5 !h-5' color={color} />}
                        href='/profile'
                        name='Profile'
                    />
                </NavigationMenuList>
            </NavigationMenu>
        </div>
    )
}

export default BottomTabBar
