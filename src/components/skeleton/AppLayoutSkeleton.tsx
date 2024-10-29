import React from 'react'
import { clsx } from 'clsx'
import { LoadingSpinner } from '@/components/ui/spinner.tsx'

const AppLayoutSkeleton: React.FC = () => {
    return (
        <div
            className={clsx(
                'bg-background h-screen w-full flex flex-col items-center justify-center'
            )}
        >
            <div className='w-full max-w-md p-6 space-y-8'>
                <div className='w-full flex justify-center'>
                    <LoadingSpinner />
                </div>
            </div>
        </div>
    )
}

export default AppLayoutSkeleton
