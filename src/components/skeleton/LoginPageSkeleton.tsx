import React from 'react'
import { clsx } from 'clsx'
import { LoadingSpinner } from '@/components/ui/spinner.tsx'
import { Skeleton } from '../ui/skeleton'

const LoginPageSkeleton: React.FC = () => {
    return (
        <div
            className={clsx(
                'bg-background h-screen w-full flex flex-col items-center justify-center'
            )}
        >
            <div className='w-full max-w-md p-6 space-y-8'>
                <div className='flex flex-col justify-center items-center gap-2'>
                    <LoadingSpinner />
                    <Skeleton className='px-4 py-2'>Loading...</Skeleton>
                </div>
            </div>
        </div>
    )
}

export default LoginPageSkeleton
