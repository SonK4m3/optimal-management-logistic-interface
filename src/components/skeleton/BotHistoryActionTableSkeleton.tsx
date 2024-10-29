import React from 'react'
import { Skeleton } from '../ui/skeleton'

const BotHistoryActionTableSkeleton: React.FC = () => {
    return (
        <div className='flex flex-col gap-2 mt-4'>
            <div className='text-lg font-semibold'>
                <Skeleton className='h-6 w-[150px]' />
            </div>
            <div className='flex flex-col gap-3'>
                <div className='bg-secondary/30 rounded'>
                    <div className='shadow-md p-4'>
                        <div className='flex justify-between'>
                            <Skeleton className='h-5 w-[50%]' />
                            <Skeleton className='h-5 w-[50%]' />
                        </div>
                    </div>
                    {[...Array(5)].map((_, index) => (
                        <div key={index} className='flex justify-between p-4 border-t'>
                            <Skeleton className='h-4 w-[40%]' />
                            <Skeleton className='h-8 w-[20%] rounded-lg' />
                        </div>
                    ))}
                    <div className='p-4 border-t'>
                        <Skeleton className='h-10 w-full' />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default BotHistoryActionTableSkeleton
