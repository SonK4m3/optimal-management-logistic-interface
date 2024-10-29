import React, { memo } from 'react'
import SheetMenu from '@/components/SheetMenu'
import { ModeToggle } from '@/components/mode-toggle'
import UserNav from './UserNav'
import { useSelector } from 'react-redux'
import { RootState } from '@/store'
import { Button } from '@/components/ui/button'
import { useModalContext } from '@/contexts/ModalContext'
import LoginModal from './LoginModal'
import configs from '@/configs'
import { useNavigate } from 'react-router-dom'

const Navbar: React.FC<{ title: string; actions?: React.ReactNode }> = ({ title, actions }) => {
    const user = useSelector((state: RootState) => state.user.user)
    const { openModal } = useModalContext()
    const navigate = useNavigate()

    const handleLogin = () => {
        if (configs.redirectToLoginPage) {
            navigate('/login')
        } else {
            openModal({
                title: 'Sign up',
                content: <LoginModal />
            })
        }
    }

    return (
        <header className='sticky top-0 z-10 w-full bg-accent shadow backdrop-blur supports-[backdrop-filter]:bg-accent dark:shadow-accent'>
            <div className='mx-4 sm:mx-8 flex h-14 items-center gap-4'>
                <div className='flex items-center space-x-4 lg:space-x-0'>
                    <SheetMenu />
                    <h1 className='font-bold'>{title}</h1>
                </div>
                <div className='hidden flex-1 items-center justify-end'>
                    <ModeToggle />
                </div>
                <div className='flex-1 flex items-center justify-end'>{actions}</div>
                <div className='flex items-center justify-end'>
                    {user ? (
                        <UserNav user={user} />
                    ) : (
                        <div>
                            <Button variant={'emerald'} onClick={handleLogin}>
                                Sign up
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    )
}

export default memo(Navbar)
