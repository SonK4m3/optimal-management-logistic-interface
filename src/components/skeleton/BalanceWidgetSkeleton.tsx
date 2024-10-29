import React from 'react'
import { Skeleton } from '@/components/ui/skeleton'

const BalanceWidgetSkeleton: React.FC = () => {
    return (
        <div className='w-full flex justify-between gap-2 text-sm'>
            <Skeleton className='h-4 w-[100px]' />
            <Skeleton className='h-4 w-[60px]' />
        </div>
    )
}

export default BalanceWidgetSkeleton
