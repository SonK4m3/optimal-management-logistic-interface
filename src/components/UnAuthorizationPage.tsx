import React, { useEffect } from 'react'
import { clsx } from 'clsx'
import Navbar from '@/components/Navbar.tsx'
import { useModalContext } from '@/contexts/ModalContext'
import LoginModal from './LoginModal'
import { RootState } from '@/store'
import { useSelector } from 'react-redux'
import LoginPageSkeleton from '@/components/skeleton/LoginPageSkeleton'

const UnAuthorizationPage: React.FC = () => {
    const { openModal } = useModalContext()
    const { isLoading } = useSelector((state: RootState) => state.user)

    const autoShowLoginModal = () => {
        openModal({
            title: 'Sign up',
            content: <LoginModal />
        })
    }

    useEffect(() => {
        autoShowLoginModal()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    if (isLoading) {
        return <LoginPageSkeleton />
    }

    return (
        <div className={clsx('bg-background', 'w-full h-screen')}>
            <Navbar title={''} />
            <div className='flex flex-col gap-4 p-4'>
                <h1 className='text-xl font-bold'>Please login to continue</h1>
            </div>
        </div>
    )
}

export default UnAuthorizationPage
