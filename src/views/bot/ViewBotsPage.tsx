import React, { Fragment } from 'react'
import { BotProvider, useBotContext } from '@/contexts/BotContext.tsx'
import { LoadingSpinner } from '@/components/ui/spinner.tsx'
import { Circle, X } from 'lucide-react'
import { clsx } from 'clsx'
import Navbar from '@/components/Navbar.tsx'
import { Bot } from '@/types'
import { Button } from '@/components/ui/button.tsx'
import { useNavigate } from 'react-router-dom'
import AddBotButton from '@/components/AddBotButton'

const InfoRow: React.FC<{
    label: string
    value: string | number
}> = ({ label, value }) => {
    return (
        <p>
            <span className='text-sm text-gray-500'>{label}:</span> <span>{value}</span>
        </p>
    )
}

const ListBotItem: React.FC<{
    bot: Bot
    handleDeleteBot: (botId: number) => Promise<void>
    onClick: (bot: Bot | undefined) => void
}> = ({ bot, handleDeleteBot, onClick }) => {
    const { strategy, botId } = bot

    return (
        <div className={'bg-secondary rounded-lg shadow-lg'}>
            <div className={'flex flex-col p-4 w-full cursor-pointer'} onClick={() => onClick(bot)}>
                <div className='flex justify-between items-center'>
                    <div className='flex gap-4 items-center justify-start'>
                        <Circle size={16} className='text-green-500 flex' />
                        <h2 className='text-md font-bold'>{botId}</h2>
                    </div>
                    <div className='flex gap-3 justify-center items-center'>
                        <div
                            className={clsx(
                                strategy.orderSide === 'BUY'
                                    ? 'bg-color-accent-green-700 border-color-accent-green-900'
                                    : 'bg-color-accent-red-700 border-color-accent-red-900',
                                'border rounded-lg px-4 py-1'
                            )}
                        >
                            {strategy.orderSide}
                        </div>
                        <div className='bg-gray-500 rounded-lg px-4 py-1'>{strategy.orderType}</div>
                        <Button
                            className='hidden'
                            variant={'destructive'}
                            size={'icon'}
                            onClick={event => {
                                event.stopPropagation()
                                handleDeleteBot(botId)
                            }}
                        >
                            <X size={16} />
                        </Button>
                    </div>
                </div>
                <div className='flex flex-col gap-3 w-full'>
                    <div className='flex justify-between items-center'>
                        <InfoRow label='Pool' value={strategy.poolId} />
                    </div>
                    <div className='flex justify-between items-center'>
                        <div className='flex gap-2'>
                            <InfoRow label='Size' value={`${strategy.orderSize ?? 0} BTC`} />
                            <InfoRow label='Profit' value={`${strategy.takeProfitPercentage}%`} />
                            <InfoRow label='Loss' value={`${strategy.stopLossPercentage}%`} />
                        </div>
                        <InfoRow label='Exchange' value={strategy.exchange} />
                    </div>
                </div>
            </div>
        </div>
    )
}

const ListBotLayout = () => {
    const navigate = useNavigate()
    const { bots, handleDeleteBot } = useBotContext()

    const handleSelectBot = (bot: Bot | undefined) => {
        navigate(`/bots/${bot?.botId}`)
    }

    if (bots === undefined) {
        return <LoadingSpinner />
    }

    if (bots === null) {
        return <div>No data</div>
    }

    return (
        <div className='flex flex-col gap-2'>
            <div className='text-lg font-semibold'>My bots</div>
            <div className='flex flex-col gap-4 bg-background px-3 py-4 rounded-lg'>
                {bots?.map(bot => (
                    <Fragment key={bot.botId}>
                        <ListBotItem
                            bot={bot}
                            handleDeleteBot={handleDeleteBot}
                            onClick={handleSelectBot}
                        />
                    </Fragment>
                ))}
            </div>
        </div>
    )
}

const ViewBotsPage: React.FC = () => {
    return (
        <div className={clsx('bg-background', 'w-full h-auto')}>
            <Navbar title={'Bots'} actions={<AddBotButton />} />
            <div className='w-full min-h-[100vh] flex flex-col p-4'>
                <BotProvider>
                    <ListBotLayout />
                </BotProvider>
            </div>
        </div>
    )
}

export default ViewBotsPage
