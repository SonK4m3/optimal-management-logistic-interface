import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { useModalContext } from '@/contexts/ModalContext'
import { GoogleIcon } from '@/components/icon'
import { Input } from './ui/input'
import { useForm } from 'react-hook-form'
import { useAuthContext } from '@/contexts/AuthContext'
import { toast } from './ui/use-toast'
const LoginModal: React.FC = () => {
    const { closeModal } = useModalContext()
    const { handleLogin, handleRegister } = useAuthContext()

    const [formType, setFormType] = useState<'login' | 'register'>('login')

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm({
        defaultValues: {
            username: 'test01',
            password: '123456',
            email: 'test01@gmail.com'
        }
    })

    const onSubmit = async (data: { username: string; password: string }) => {
        handleLogin(data, () => {
            closeModal()
        })
    }

    const onRegisterSubmit = async (data: {
        username: string
        password: string
        email: string
    }) => {
        handleRegister(
            data,
            () => {
                setFormType('login')
            },
            error => {
                toast({
                    variant: 'destructive',
                    title: 'Register failed',
                    description: error
                })
            }
        )
    }

    return (
        <div className='space-y-4'>
            <div>
                {formType === 'login' ? (
                    <form className='space-y-4' onSubmit={handleSubmit(onSubmit)}>
                        <div>
                            <label htmlFor='username' className='text-sm font-medium'>
                                Username
                            </label>
                            <Input
                                type='text'
                                placeholder='Username'
                                className='w-full'
                                {...register('username', { required: 'Username is required' })}
                            />
                            {errors.username && (
                                <p className='text-xs text-red-500'>{errors.username.message}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor='password' className='text-sm font-medium'>
                                Password
                            </label>
                            <Input
                                type='password'
                                placeholder='Password'
                                className='w-full'
                                {...register('password', { required: 'Password is required' })}
                            />
                            {errors.password && (
                                <p className='text-xs text-red-500'>{errors.password.message}</p>
                            )}
                        </div>

                        <Button type='submit' variant='successSolid' className='w-full'>
                            Login
                        </Button>
                    </form>
                ) : (
                    <form className='space-y-4' onSubmit={handleSubmit(onRegisterSubmit)}>
                        <div>
                            <label htmlFor='username' className='text-sm font-medium'>
                                Username
                            </label>
                            <Input
                                type='text'
                                placeholder='Username'
                                className='w-full'
                                {...register('username', { required: 'Username is required' })}
                            />
                            {errors.username && (
                                <p className='text-xs text-red-500'>{errors.username.message}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor='email' className='text-sm font-medium'>
                                Email
                            </label>
                            <Input
                                type='email'
                                placeholder='Email'
                                className='w-full'
                                {...register('email', { required: 'Email is required' })}
                            />
                            {errors.email && (
                                <p className='text-xs text-red-500'>{errors.email.message}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor='password' className='text-sm font-medium'>
                                Password
                            </label>
                            <Input
                                type='password'
                                placeholder='Password'
                                className='w-full'
                                {...register('password', { required: 'Password is required' })}
                            />
                            {errors.password && (
                                <p className='text-xs text-red-500'>{errors.password.message}</p>
                            )}
                        </div>

                        <Button type='submit' variant='successSolid' className='w-full'>
                            Register
                        </Button>
                    </form>
                )}
            </div>
            <div>
                <div
                    onClick={() => setFormType(prev => (prev === 'login' ? 'register' : 'login'))}
                    className='w-full text-center text-sm text-muted-foreground cursor-pointer hover:text-primary hover:underline'
                >
                    {formType === 'login' ? 'Register' : 'Login'}
                </div>
            </div>
            <div className='flex flex-col items-center justify-center'>
                <div className='h-[1px] w-full bg-border'></div>
                <span className='text-sm text-muted-foreground px-4'>OR</span>
            </div>
            <div className='grid grid-cols-1 gap-4'>
                <Button variant='default' size='iconGroupLg' onClick={() => {}} className='w-full'>
                    <GoogleIcon /> Login with Google
                </Button>
            </div>
        </div>
    )
}

export default LoginModal
