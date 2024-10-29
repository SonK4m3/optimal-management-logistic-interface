import React from 'react'
import { clsx } from 'clsx'
import { Button } from '@/components/ui/button.tsx'
import DrawerProvider, { useDrawerContext } from '@/contexts/DrawerContext.tsx'
import ViewBotsDrawer from '@/views/bot/ViewBotsDrawer.tsx'
import { useNavigate } from 'react-router-dom'

const ViewBotDrawreButton = () => {
    const { openDrawer } = useDrawerContext()

    return (
        <Button
            variant='emerald'
            onClick={() => {
                openDrawer({
                    background: 'bg-gray-100',
                    content: <ViewBotsDrawer />
                })
            }}
        >
            Bots
        </Button>
    )
}

const Header: React.FC = () => {
    const navigate = useNavigate()

    return (
        <div
            className={clsx(
                'h-[10vh] w-full bg-white border-b-[1px] border-gray-100 shadow',
                'fixed z-10 left-0 right-0 top-0',
                'flex justify-center items-center gap-2',
                'px-4'
            )}
        >
            <h1 className='text-lg font-bold'>Trading bot</h1>
            <div className='flex-1 flex justify-end items-center gap-2'>
                <div>
                    <Button variant='emerald' onClick={() => navigate('/home')}>
                        Start new Bot
                    </Button>
                </div>
                <div>
                    <DrawerProvider>
                        <ViewBotDrawreButton />
                    </DrawerProvider>
                </div>
            </div>
        </div>
    )
}

export default Header
