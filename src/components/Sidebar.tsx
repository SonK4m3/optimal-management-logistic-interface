import React from 'react'
import { Button } from '@/components/ui/button.tsx'
import Menu from '@/components/Menu.tsx'
import SidebarToggle from '@/components/SidebarToggle.tsx'
import { useSidebarToggle } from '@/hooks/useSidebarToggle.ts'
import clsx from 'clsx'
import { useNavigate } from 'react-router-dom'

const Sidebar: React.FC = () => {
    const sidebar = useSidebarToggle()
    const navigate = useNavigate()
    if (!sidebar) return null
    return (
        <aside
            className={clsx(
                'fixed top-0 left-0 z-20 h-screen lg:translate-x-0 transition-[width] ease-in-out duration-300',
                sidebar?.isOpen === false ? 'w-[90px]' : 'w-72'
            )}
        >
            <SidebarToggle isOpen={sidebar?.isOpen} setIsOpen={sidebar?.setIsOpen} />
            <div className='relative h-full flex flex-col px-3 py-4 overflow-y-auto shadow-md dark:shadow-zinc-800 bg-background'>
                <Button
                    className={clsx(
                        'transition-transform ease-in-out duration-300 mb-1',
                        sidebar?.isOpen === false ? 'translate-x-1' : 'translate-x-0'
                    )}
                    variant='link'
                    onClick={() => navigate('/')}
                >
                    <h1
                        className={clsx(
                            'font-bold text-lg whitespace-nowrap transition-[transform,opacity,display] ease-in-out duration-300',
                            sidebar?.isOpen === false
                                ? '-translate-x-96 opacity-0 hidden'
                                : 'translate-x-0 opacity-100'
                        )}
                    >
                        Logistics
                    </h1>
                </Button>
                <Menu isOpen={sidebar?.isOpen} />
            </div>
        </aside>
    )
}

export default Sidebar
