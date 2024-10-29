import React, { createContext, useContext, useState, useEffect } from 'react'
import RequestFactory from '@/services/RequestFactory'
import { Bot, BotAction } from '@/types'
import { BotActionsQueryParams } from '@/types/request'
import { useToast } from '@/components/ui/use-toast'
import { useNavigate } from 'react-router-dom'

interface BotDetailContextProps {
    bot: Bot | undefined | null
    botActions: BotAction[] | undefined | null
    fetchBotActions: (params: BotActionsQueryParams) => Promise<void>
    handleDeleteBot: (botId: number) => Promise<void>
    handleNextPage: () => void
    handlePreviousPage: () => void
    currentPage: number
    hasNextPage: boolean
    hasPreviousPage: boolean
    handlePageChange: (page: number) => void
}

const BotDetailContext = createContext<BotDetailContextProps | undefined>(undefined)

export const BotDetailProvider: React.FC<{
    children: React.ReactNode
    botId: string | undefined
}> = ({ children, botId }) => {
    const request = RequestFactory.getRequest('BotRequest')
    const { toast } = useToast()
    const navigate = useNavigate()

    const [bot, setBot] = useState<Bot | null | undefined>(undefined)
    const [botActions, setBotActions] = useState<BotAction[] | undefined | null>(undefined)
    const [currentPage, setCurrentPage] = useState<number>(1)
    const [hasNextPage, setHasNextPage] = useState<boolean>(false)
    const [hasPreviousPage, setHasPreviousPage] = useState<boolean>(false)

    const fetchBot = async () => {
        try {
            const response = await request.getBotById(Number(botId))
            if (response) {
                setBot(response)
            } else {
                setBot(null)
            }
        } catch (err) {
            console.error('Failed to fetch bot:', err)
            setBot(null)
        }
    }

    const fetchBotActions = async (params: BotActionsQueryParams) => {
        try {
            const response = await request.getBotActions(Number(botId), params)
            if (response) {
                setBotActions(response.docs)

                setCurrentPage(response.page)
                setHasNextPage(response.hasNextPage)
                setHasPreviousPage(response.hasPrevPage)
            } else {
                setBotActions(null)
            }
        } catch (err) {
            console.error('Failed to fetch bot actions:', err)
            setBotActions(null)
        }
    }

    useEffect(() => {
        const fetchData = async () => {
            const params: BotActionsQueryParams = {
                page: 1,
                limit: 10,
                order: 'DESC'
            }

            await Promise.all([fetchBot(), fetchBotActions(params)])
        }
        if (botId && !isNaN(Number(botId)) && Number(botId) !== 0) {
            fetchData()
        }
    }, [botId])

    useEffect(() => {
        if ((currentPage === 1 && hasPreviousPage) || hasNextPage) {
            const params: BotActionsQueryParams = {
                page: currentPage,
                limit: 10,
                order: 'DESC'
            }
            fetchBotActions(params)
        }
    }, [currentPage])

    const handleDeleteBot = async (botId: number) => {
        try {
            const response = await request.deleteBot(botId)
            if (response) {
                toast({
                    variant: 'success',
                    title: 'Delete Bot Success'
                })
                navigate('/bots')
            } else {
                toast({
                    variant: 'destructive',
                    title: 'Delete Bot Failure'
                })
            }
        } catch (err) {
            toast({
                variant: 'destructive',
                title: 'Delete Bot Error'
            })
            console.error(err)
        }
    }

    const handleNextPage = () => {
        if (hasNextPage) {
            setCurrentPage(prev => prev + 1)
        }
    }

    const handlePreviousPage = () => {
        if (hasPreviousPage) {
            setCurrentPage(prev => prev - 1)
        }
    }

    const handlePageChange = (page: number) => {
        setCurrentPage(page)
    }

    return (
        <BotDetailContext.Provider
            value={{
                bot,
                botActions,
                fetchBotActions,
                handleDeleteBot,
                handleNextPage,
                handlePreviousPage,
                currentPage,
                hasNextPage,
                hasPreviousPage,
                handlePageChange
            }}
        >
            {children}
        </BotDetailContext.Provider>
    )
}

export const useBotDetailContext = (): BotDetailContextProps => {
    const context = useContext(BotDetailContext)
    if (context === undefined) {
        throw new Error('useBotDetailContext must be used within a BotDetailProvider')
    }
    return context
}
