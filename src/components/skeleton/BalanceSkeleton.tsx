import React from 'react'
import { Skeleton } from '@/components/ui/skeleton'

const BalanceSkeleton: React.FC = () => {
    return (
        <div className='flex flex-col items-center justify-center gap-1'>
            <Skeleton className='h-6 w-[150px]' />
            <Skeleton className='h-4 w-[100px]' />
        </div>
    )
}

export default BalanceSkeleton
