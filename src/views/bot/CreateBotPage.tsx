import React from 'react'
import { clsx } from 'clsx'
import BotForm from '@/views/bot/BotForm.tsx'
import { CreateBotProvider } from '@/contexts/CreateBotContext.tsx'
import Navbar from '@/components/Navbar.tsx'

const CreateBotPage: React.FC = () => {
    return (
        <div className={clsx('bg-background', 'w-full h-screen')}>
            <Navbar title={'Create DCA Bot'} />
            <div className='flex flex-col gap-4 p-4'>
                <h1>Create DCA Bot</h1>
                <CreateBotProvider>
                    <BotForm />
                </CreateBotProvider>
            </div>
        </div>
    )
}

export default CreateBotPage
