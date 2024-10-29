import React from 'react'
import { BotProvider, useBotContext } from '@/contexts/BotContext.tsx'
import { Button } from '@/components/ui/button.tsx'
import { X } from 'lucide-react'
import { LoadingSpinner } from '@/components/ui/spinner.tsx'

const ListBotLayout = () => {
    const { bots, handleDeleteBot } = useBotContext()

    if (bots === undefined) {
        return <LoadingSpinner />
    }

    if (bots === null) {
        return <div>No data</div>
    }

    return (
        <div className='flex flex-col gap-3 overflow-y-scroll'>
            {bots?.map(bot => (
                <div key={bot.botId} className={'bg-gray-200 rounded-lg p-4 flex justify-between'}>
                    <div>Id {bot.botId}</div>
                    <div>
                        <Button
                            variant='destructive'
                            size={'icon'}
                            onClick={() => handleDeleteBot(bot.botId)}
                        >
                            <X size={16} />
                        </Button>
                    </div>
                </div>
            ))}
        </div>
    )
}

const ViewBotsDrawer: React.FC = () => {
    return (
        <div className='w-full h-[80vh] flex flex-col p-4'>
            <h1 className='text-lg font-bold'>Bots</h1>
            <BotProvider>
                <ListBotLayout />
            </BotProvider>
        </div>
    )
}

export default ViewBotsDrawer
