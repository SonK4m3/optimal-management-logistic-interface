import React from 'react'
import { Skeleton } from '../ui/skeleton'

const BotDetailInfoSkeleton: React.FC = () => {
    return (
        <div className='bg-secondary rounded-xl p-4'>
            <div className='bg-secondary rounded-lg flex flex-col p-4 w-full'>
                <div className='flex justify-between items-center'>
                    <div className='flex gap-4 items-center justify-start'>
                        <Skeleton className='h-6 w-[150px]' />
                    </div>
                    <div className='flex gap-3 justify-center items-center'>
                        <Skeleton className='h-8 w-[80px] rounded-lg' />
                        <Skeleton className='h-8 w-[80px] rounded-lg' />
                    </div>
                </div>
                <div className='flex flex-col gap-4 w-full mt-4'>
                    <div className='flex justify-between items-center'>
                        <Skeleton className='h-4 w-[200px]' />
                    </div>
                    <div className='flex justify-between items-center'>
                        <div className='flex gap-2'>
                            <Skeleton className='h-4 w-[100px]' />
                            <Skeleton className='h-4 w-[100px]' />
                            <Skeleton className='h-4 w-[100px]' />
                        </div>
                        <Skeleton className='h-4 w-[100px]' />
                    </div>
                </div>
                <div className='flex flex-col gap-4 w-full mt-4'>
                    <div className='flex justify-between items-center'>
                        <Skeleton className='h-4 w-[200px]' />
                    </div>
                    <div className='flex justify-between items-center'>
                        <div className='flex gap-2'>
                            <Skeleton className='h-4 w-[100px]' />
                            <Skeleton className='h-4 w-[100px]' />
                            <Skeleton className='h-4 w-[100px]' />
                        </div>
                        <Skeleton className='h-4 w-[100px]' />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default BotDetailInfoSkeleton
