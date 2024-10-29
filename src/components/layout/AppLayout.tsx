import React, { Suspense } from 'react'
import AppLayoutSkeleton from '@/components/skeleton/AppLayoutSkeleton.tsx'
import { Outlet } from 'react-router-dom'
import { Toaster } from '@/components/ui/toaster.tsx'
import Sidebar from '@/components/Sidebar.tsx'
import { useSidebarToggle } from '@/hooks/useSidebarToggle.ts'
import { cn } from '@/lib/utils.ts'

const AppLayout: React.FC = () => {
    const sidebar = useSidebarToggle()
    if (!sidebar) return null

    return (
        <>
            <Sidebar />
            <main
                className={cn(
                    'min-h-[calc(100vh_-_56px)] bg-zinc-50 dark:bg-zinc-900 transition-[margin-left] ease-in-out duration-300',
                    sidebar?.isOpen === false ? 'ml-[90px]' : 'ml-72'
                )}
            >
                <div className='flex-grow flex flex-col'>
                    <Suspense fallback={<AppLayoutSkeleton />}>
                        <Outlet />
                    </Suspense>
                </div>
            </main>
            <Toaster />
        </>
    )
}

export default AppLayout
