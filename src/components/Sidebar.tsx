import React from 'react'
import { cn } from '@/lib/utils.ts'
import { Button } from '@/components/ui/button.tsx'
import { PanelsTopLeft } from 'lucide-react'
import Menu from '@/components/Menu.tsx'
import SidebarToggle from '@/components/SidebarToggle.tsx'
import { useSidebarToggle } from '@/hooks/useSidebarToggle.ts'

const Sidebar: React.FC = () => {
    const sidebar = useSidebarToggle()
    if (!sidebar) return null
    return (
        <aside
            className={cn(
                'fixed top-0 left-0 z-20 h-screen lg:translate-x-0 transition-[width] ease-in-out duration-300',
                sidebar?.isOpen === false ? 'w-[90px]' : 'w-72'
            )}
        >
            <SidebarToggle isOpen={sidebar?.isOpen} setIsOpen={sidebar?.setIsOpen} />
            <div className='relative h-full flex flex-col px-3 py-4 overflow-y-auto shadow-md dark:shadow-zinc-800 bg-background'>
                <Button
                    className={cn(
                        'transition-transform ease-in-out duration-300 mb-1',
                        sidebar?.isOpen === false ? 'translate-x-1' : 'translate-x-0'
                    )}
                    variant='link'
                >
                    <PanelsTopLeft className='w-6 h-6 mr-1' />
                    <h1
                        className={cn(
                            'font-bold text-lg whitespace-nowrap transition-[transform,opacity,display] ease-in-out duration-300',
                            sidebar?.isOpen === false
                                ? '-translate-x-96 opacity-0 hidden'
                                : 'translate-x-0 opacity-100'
                        )}
                    >
                        Trading Bot
                    </h1>
                </Button>
                <Menu isOpen={sidebar?.isOpen} />
            </div>
        </aside>
    )
}

export default Sidebar
