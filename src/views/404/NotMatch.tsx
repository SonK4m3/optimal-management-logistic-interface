import React from 'react'
import { clsx } from 'clsx'

const NotMatch: React.FC = () => {
    return (
        <div className={clsx('w-full h-[100vh] flex justify-center items-center', 'bg-background')}>
            <h1 className='text-primary text-lg'>This page not found!</h1>
        </div>
    )
}

export default NotMatch
