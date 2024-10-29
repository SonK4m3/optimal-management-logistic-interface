import React, { useState } from 'react'
import SotatekLogo from '@/assets/sotatek.png'
import { Button } from '@/components/ui/button'
import { GoogleIcon } from '@/components/icon'
import { Checkbox } from '@/components/ui/checkbox'
import LoginPageSkeleton from '@/components/skeleton/LoginPageSkeleton'
import { useSelector } from 'react-redux'
import { RootState } from '@/store'

const LinkTerm: React.FC<{ text: string }> = ({ text }) => {
    return <span className='text-blue-500 cursor-pointer'>{text}</span>
}

const CheckboxWithText = ({ handleCheckedTerm }: { handleCheckedTerm: () => void }) => {
    return (
        <div className='flex items-center gap-2'>
            <Checkbox id='terms1' onClick={handleCheckedTerm} />
            <div className='text-sm text-muted-foreground'>
                Agree to our <LinkTerm text='Terms of Service' /> and{' '}
                <LinkTerm text='Privacy Policy' />
            </div>
        </div>
    )
}

const LoginPage: React.FC = () => {
    const { isLoading } = useSelector((state: RootState) => state.user)
    const [checkedTerm, setCheckedTerm] = useState(false)

    const handleLogin = () => {}

    const handleCheckedTerm = () => {
        setCheckedTerm(!checkedTerm)
    }

    if (isLoading) {
        return <LoginPageSkeleton />
    }

    return (
        <div className='flex items-center justify-center h-screen'>
            <div className='bg-white p-8 rounded-2xl shadow-lg flex flex-col items-center justify-center max-w-[25rem] gap-6'>
                <div className='flex flex-col items-center justify-center w-20 h-20'>
                    <img src={SotatekLogo} alt='Sotatek Logo' className='w-full h-full' />
                </div>
                <div className='flex flex-col items-center justify-center'>
                    <div className='text-2xl font-bold text-color-neutral-alpha-900'>
                        Trading bot
                    </div>
                </div>

                <CheckboxWithText handleCheckedTerm={handleCheckedTerm} />

                <div className='w-full grid grid-cols-1  gap-4'>
                    <Button
                        variant='outline'
                        size='iconGroupLg'
                        onClick={() => handleLogin()}
                        className='w-full'
                        disabled={!checkedTerm}
                    >
                        <GoogleIcon /> Login with Google
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default LoginPage
