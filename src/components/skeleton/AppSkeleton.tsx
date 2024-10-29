import React from 'react'
import { clsx } from 'clsx'

const AppSkeleton: React.FC = () => {
    return <div className={clsx('bg-background h-screen w-full')}></div>
}

export default AppSkeleton
