import React from 'react'
import { clsx } from 'clsx'
import Navbar from '@/components/Navbar.tsx'

const HomePage: React.FC = () => {
    return (
        <div className={clsx('bg-background', 'w-full h-screen')}>
            <Navbar title={'Home'} />
            <div className='flex flex-col gap-4 p-4'></div>
        </div>
    )
}

export default HomePage
