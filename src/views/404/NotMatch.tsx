import React from 'react'
import { clsx } from 'clsx'
import { Link } from 'react-router-dom'

const NotMatch: React.FC = () => {
    return (
        <div className={clsx('w-full h-[100vh] flex justify-center items-center', 'bg-background')}>
            <div className='flex flex-col gap-4 justify-center items-center'>
                <h1 className='text-primary text-lg'>This page not found!</h1>
                <Link
                    to='/'
                    className='bg-primary text-neutral-900 px-4 py-2 rounded-md hover:bg-primary/80'
                >
                    Go to home
                </Link>
            </div>
        </div>
    )
}

export default NotMatch
