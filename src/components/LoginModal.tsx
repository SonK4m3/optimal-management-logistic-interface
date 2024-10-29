import React from 'react'
import { Button } from '@/components/ui/button'
import { useModalContext } from '@/contexts/ModalContext'
import useOauth from '@/hooks/useOauth'
import { OAuthProvider } from '@/types'
import { GoogleIcon } from '@/components/icon'

const LoginModal: React.FC = () => {
    const { closeModal } = useModalContext()
    const { authenticate } = useOauth()

    const handleLogin = (provider: OAuthProvider) => {
        authenticate(provider).connectMethod()
        closeModal()
    }

    return (
        <div className='grid grid-cols-1  gap-4 py-4'>
            <Button
                variant='default'
                size='iconGroupLg'
                onClick={() => handleLogin('GOOGLE')}
                className='w-full'
            >
                <GoogleIcon /> Login with Google
            </Button>
        </div>
    )
}

export default LoginModal
