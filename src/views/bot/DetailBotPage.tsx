import Navbar from '@/components/Navbar'
import { Link, useParams } from 'react-router-dom'
import BotHistoryActionTable from './BotHistoryActionTable'
import clsx from 'clsx'
import { BBCondition, ChainType, MACondition, RSICondition } from '@/types'
import { Button } from '@/components/ui/button'
import {
    ChevronLeft,
    ChevronRight,
    LucideIcon,
    Trash,
    Coins,
    CirclePercent,
    SquarePercent,
    TriangleAlert,
    Check,
    Copy
} from 'lucide-react'
import React, { useMemo, useState } from 'react'
import AddBotButton from '@/components/AddBotButton'
import { BotDetailProvider, useBotDetailContext } from '@/contexts/BotDetailContext'
import useFetchExchange from '@/hooks/useFetchExchange'
import { BBPercentBConditionType, MAConditionType, SimpleConditionType } from '@/types/enum'
import BotDetailInfoSkeleton from '@/components/skeleton/BotDetailInfoSkeleton'
import useNativeBalance from '@/hooks/useNativeBalance'
import useBalance from '@/hooks/useBalance'
import BalanceSkeleton from '@/components/skeleton/BalanceSkeleton'
import { formatNumberWithCommas, truncateString } from '@/lib/utils'
import { useModalContext } from '@/contexts/ModalContext'
import useCopyToClipboard from '@/hooks/useCopyToClipboard'

const chainTypeMap: Record<ChainType, string> = {
    BSC_MAINNET: 'BSC Mainnet',
    BSC_TESTNET: 'BSC Testnet',
    BITCOIN_MAINNET: 'Bitcoin Mainnet',
    BITCOIN_TESTNET: 'Bitcoin Testnet',
    ETH_MAINNET: 'ETH Mainnet',
    ETH_TESTNET: 'ETH Testnet'
}

const InfoRow: React.FC<{
    label: string
    value: string | number | React.ReactNode
}> = ({ label, value }) => {
    return (
        <p>
            <span className='text-sm text-gray-500'>{label}:</span> <span>{value}</span>
        </p>
    )
}

const IconInfoRow: React.FC<{
    icon: LucideIcon
    value: string | number
}> = ({ icon: LIcon, value }) => {
    return (
        <div className='bg-gray-700 rounded-xl p-2 min-w-[80px] flex flex-col items-center justify-center gap-2'>
            <div>
                <LIcon size={14} className='text-color-emerald' />
            </div>
            <div className='text-sm font-semibold'>{value}</div>
        </div>
    )
}

const Conditions = () => {
    const { bot } = useBotDetailContext()

    const conditions = useMemo(() => bot?.conditions ?? [], [bot])
    const [currentIndex, setCurrentIndex] = useState(0)

    const simpleConditionTypeList = Object.values(SimpleConditionType)
    const maconditionTypeList = Object.values(MAConditionType)
    const bbPercentBconditionTypeList = Object.values(BBPercentBConditionType)

    const handleNext = () => {
        setCurrentIndex(prevIndex => Math.min(prevIndex + 1, conditions.length - 1))
    }

    const handleBack = () => {
        setCurrentIndex(prevIndex => Math.max(prevIndex - 1, 0))
    }

    const currentCondition = useMemo(() => conditions[currentIndex], [conditions, currentIndex])

    if (bot === undefined) {
        return (
            <div className='flex-1 shadow-md'>
                <BotDetailInfoSkeleton />
            </div>
        )
    }

    if (bot === null) {
        return (
            <div className='flex-1 flex justify-center items-center gap-2'>
                <TriangleAlert size={16} /> No conditions
            </div>
        )
    }

    return (
        <div className='flex-1 bg-secondary rounded-xl p-4 shadow-md flex flex-col gap-4'>
            <div className='flex-1'>
                <div className='text-sm font-semibold border-b border-gray-300 inline'>
                    Condition {currentIndex + 1} of {conditions.length}
                </div>
                <div className='flex justify-start items-center gap-4 mt-4'>
                    <InfoRow label='Type' value={currentCondition.conditionType} />
                    <InfoRow
                        label='Operator'
                        value={currentCondition.operator.toLowerCase().replace(/_/g, ' ')}
                    />
                    <InfoRow label='Time Frame' value={currentCondition.timeFrame} />
                </div>
                {maconditionTypeList.includes(
                    currentCondition.conditionType as MAConditionType
                ) && (
                    <div className='flex justify-start items-center gap-4 mt-2'>
                        <InfoRow label='Indicator' value={currentCondition.indicatorName} />
                        <InfoRow
                            label='Fast MA'
                            value={(currentCondition as MACondition).fastPeriod}
                        />
                        <InfoRow
                            label='Slow MA'
                            value={(currentCondition as MACondition).slowPeriod}
                        />
                    </div>
                )}
                {bbPercentBconditionTypeList.includes(
                    currentCondition.conditionType as BBPercentBConditionType
                ) && (
                    <div className='flex justify-start items-center gap-4 mt-2'>
                        <InfoRow label='Period' value={(currentCondition as BBCondition).period} />
                        <InfoRow
                            label='Multiplier'
                            value={(currentCondition as BBCondition).multiplier}
                        />
                        <InfoRow
                            label='Signal Value'
                            value={(currentCondition as BBCondition).signalValue}
                        />
                    </div>
                )}
                {simpleConditionTypeList.includes(
                    currentCondition.conditionType as SimpleConditionType
                ) && (
                    <div className='flex justify-start items-center gap-4 mt-2'>
                        <InfoRow label='Period' value={(currentCondition as RSICondition).period} />
                        <InfoRow
                            label='Signal Value'
                            value={(currentCondition as RSICondition).signalValue}
                        />
                    </div>
                )}
            </div>

            <div className='flex gap-4'>
                <Button
                    variant='default'
                    size='icon'
                    onClick={handleBack}
                    disabled={currentIndex === 0}
                >
                    <ChevronLeft size={16} />
                </Button>

                <Button
                    variant='default'
                    size='icon'
                    onClick={handleNext}
                    disabled={currentIndex === conditions.length - 1}
                >
                    <ChevronRight size={16} />
                </Button>
            </div>
        </div>
    )
}

const BalanceWidget: React.FC<{
    network: ChainType
    walletAddress: string
    tokenAddress: string
}> = ({ network, walletAddress, tokenAddress }) => {
    const { balance, symbol, name, isLoading } = useBalance({
        network: network,
        walletAddress: walletAddress,
        tokenAddress: tokenAddress
    })

    if (isLoading) {
        return <BalanceSkeleton />
    }

    if (!balance || !symbol || !name) {
        return (
            <div className='w-full flex justify-between gap-2 text-sm text-gray-500'>
                No balance
            </div>
        )
    }

    return (
        <div className='flex flex-col items-center justify-center'>
            <div className='text-lg font-semibold text-color-emerald text-center'>
                {formatNumberWithCommas(Number(balance).toFixed(5))}
            </div>
            <div className='text-sm text-gray-500'>{symbol}</div>
        </div>
    )
}

const NativeBalanceWidget: React.FC<{
    network: ChainType
    walletAddress: string
}> = ({ network, walletAddress }) => {
    const { balance, symbol, name, isLoading } = useNativeBalance({
        network: network,
        walletAddress: walletAddress
    })

    if (isLoading) {
        return <BalanceSkeleton />
    }

    if (!balance || !symbol || !name) {
        return (
            <div className='w-full flex justify-between gap-2 text-sm text-gray-500'>
                No native balance
            </div>
        )
    }

    return (
        <div className='text-[1.6rem] font-bold text-color-emerald text-center'>
            {formatNumberWithCommas(Number(balance).toFixed(5))} {symbol}
        </div>
    )
}

const CopyableValue: React.FC<{
    value: string | number
}> = ({ value }) => {
    const { isCopied, copyToClipboard } = useCopyToClipboard()

    return (
        <Button variant={'link'} size={'iconGroup'} onClick={() => copyToClipboard(`${value}`)}>
            {truncateString(value.toString(), 10, 3, 3)}{' '}
            {isCopied ? <Check size={16} /> : <Copy size={16} />}
        </Button>
    )
}

const BotStrategyInfo = () => {
    const { bot } = useBotDetailContext()
    const { networks } = useFetchExchange()

    const botNetwork = useMemo(() => {
        return networks?.find(network => network.name === bot?.strategy.network)
    }, [networks, bot?.strategy.network])

    const poolName = useMemo(() => {
        if (botNetwork) {
            return `${chainTypeMap[botNetwork.name]}`
        }
        return ''
    }, [botNetwork])

    if (bot === undefined) {
        return (
            <div className='flex-1 shadow-md'>
                <BotDetailInfoSkeleton />
            </div>
        )
    }

    if (bot === null) {
        return (
            <div className='flex-1 flex justify-center items-center gap-2'>
                <TriangleAlert size={16} /> Bot not found
                <div>
                    <Link to='/bots' className='text-blue-700 underline'>
                        Back to list of bots
                    </Link>{' '}
                    or{' '}
                    <Link to='/bots/create' className='text-blue-700 underline'>
                        create a new bot
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className='flex-1 flex flex-col gap-4'>
            <div className='flex-1 flex gap-4'>
                <div className='flex-1 bg-secondary rounded-xl min-w-[25vw] flex flex-col gap-4 items-center justify-start p-4 shadow-md'>
                    <div className='flex flex-col items-center justify-center'>
                        <div className='text-sm font-semibold text-gray-500'>{poolName}</div>
                        {botNetwork && (
                            <NativeBalanceWidget
                                network={botNetwork?.name}
                                walletAddress={bot.strategy.walletAddress}
                            />
                        )}
                    </div>
                    {botNetwork && (
                        <div className='w-full grid grid-cols-2 items-center gap-4'>
                            <BalanceWidget
                                network={botNetwork?.name}
                                walletAddress={bot.strategy.walletAddress}
                                tokenAddress={bot.strategy.baseAddress}
                            />
                            <BalanceWidget
                                network={botNetwork?.name}
                                walletAddress={bot.strategy.walletAddress}
                                tokenAddress={bot.strategy.quoteAddress}
                            />
                        </div>
                    )}
                </div>
                <div className='flex-1 bg-secondary rounded-xl flex flex-col gap-4 items-center justify-center p-4 shadow-md'>
                    <div className='flex gap-3 justify-center items-center'>
                        <IconInfoRow icon={Coins} value={`${bot.strategy.orderSize ?? 0} BTC`} />
                        <IconInfoRow
                            icon={CirclePercent}
                            value={`${bot.strategy.takeProfitPercentage}%`}
                        />
                        <IconInfoRow
                            icon={SquarePercent}
                            value={`${bot.strategy.stopLossPercentage}%`}
                        />
                    </div>
                    <div className='w-full flex gap-4 justify-center items-center'>
                        <div
                            className={clsx(
                                bot.strategy.orderSide === 'BUY'
                                    ? 'bg-color-accent-green-700 border-color-accent-green-900'
                                    : 'bg-color-accent-red-700 border-color-accent-red-900',
                                'flex-1 border rounded-lg px-4 py-1 text-center'
                            )}
                        >
                            {bot.strategy.orderSide}
                        </div>
                        <div className='flex-1 bg-gray-500 rounded-lg px-4 py-1 text-center'>
                            {bot.strategy.orderType}
                        </div>
                    </div>
                </div>
            </div>
            <div className='flex-1 bg-secondary rounded-xl flex flex-col gap-4 items-center justify-start p-4 shadow-md'>
                <div className='flex flex-wrap gap-4 justify-center items-center'>
                    <InfoRow label='Exchange' value={bot.strategy.exchange} />
                    <InfoRow
                        label='Pool Id'
                        value={<CopyableValue value={bot.strategy.poolId} />}
                    />
                    <InfoRow
                        label='Base Address'
                        value={<CopyableValue value={bot.strategy.baseAddress} />}
                    />
                    <InfoRow
                        label='Quote Address'
                        value={<CopyableValue value={bot.strategy.quoteAddress} />}
                    />
                    <InfoRow
                        label='Wallet Address'
                        value={<CopyableValue value={bot.strategy.walletAddress} />}
                    />
                </div>
            </div>
        </div>
    )
}

const DetailBotPage: React.FC = () => {
    const { botId } = useParams<{ botId: string }>()

    return (
        <BotDetailProvider botId={botId}>
            <DetailBotContent botId={botId} />
        </BotDetailProvider>
    )
}

const DetailBotContent: React.FC<{ botId: string | undefined }> = ({ botId }) => {
    const { handleDeleteBot } = useBotDetailContext()
    const { openModal, closeModal } = useModalContext()

    const handleOpenDeleteModal = () => {
        openModal({
            title: 'Delete Bot',
            content: <div>Are you sure you want to delete this bot?</div>,
            footer: (
                <div className='flex justify-end gap-2'>
                    <Button variant={'default'} onClick={closeModal}>
                        Cancel
                    </Button>
                    <Button
                        variant={'accentSolid'}
                        onClick={async event => {
                            event.stopPropagation()
                            if (botId) {
                                await handleDeleteBot(Number(botId))
                            }
                            closeModal()
                        }}
                    >
                        Delete
                    </Button>
                </div>
            )
        })
    }

    return (
        <div className={clsx('bg-background', 'w-full h-auto')}>
            <Navbar title={`Details for Bot ${botId}`} actions={<AddBotButton />} />
            <div className='w-full min-h-[90vh] flex flex-col p-4 gap-4'>
                <div className='flex justify-end'>
                    <Button
                        variant={'accentGhost'}
                        size={'iconGroupLg'}
                        onClick={handleOpenDeleteModal}
                    >
                        <Trash size={16} />
                        Delete
                    </Button>
                </div>
                <div className='flex gap-4'>
                    <BotStrategyInfo />
                    <Conditions />
                </div>
                <BotHistoryActionTable />
            </div>
        </div>
    )
}

export default DetailBotPage
