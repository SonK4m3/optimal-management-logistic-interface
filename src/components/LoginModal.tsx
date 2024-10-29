import React from 'react'
import { Button } from '@/components/ui/button'
import { useModalContext } from '@/contexts/ModalContext'
import { GoogleIcon } from '@/components/icon'

const LoginModal: React.FC = () => {
    const { closeModal } = useModalContext()

    const handleLogin = () => {
        closeModal()
    }

    return (
        <div className='grid grid-cols-1  gap-4 py-4'>
            <Button
                variant='default'
                size='iconGroupLg'
                onClick={() => handleLogin()}
                className='w-full'
            >
                <GoogleIcon /> Login with Google
            </Button>
        </div>
    )
}

export default LoginModal
