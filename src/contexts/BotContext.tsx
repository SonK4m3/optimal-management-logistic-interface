import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'
import RequestFactory from '@/services/RequestFactory.ts'
import { Bot } from '@/types'
import { useToast } from '@/components/ui/use-toast.ts'
import { useNavigate } from 'react-router-dom'
import { useAuthContext } from './AuthContext'

interface BotContextProps {
    bots: Bot[] | undefined | null
    handleDeleteBot: (botId: number) => Promise<void>
    refetchBots: () => Promise<void>
}

const BotContext = createContext<BotContextProps | undefined>(undefined)

export const BotProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const request = RequestFactory.getRequest('BotRequest')
    const { toast } = useToast()
    const navigate = useNavigate()
    const { isLogin } = useAuthContext()

    const [bots, setBots] = useState<Bot[] | undefined | null>(undefined)

    const fetchBots = useCallback(async () => {
        if (!isLogin) return

        try {
            const response = await request.getBots()
            setBots(response?.docs ?? null)
        } catch (err) {
            console.error('Failed to fetch bots:', err)
            setBots(null)
        }
    }, [isLogin, request])

    useEffect(() => {
        fetchBots()
    }, [fetchBots])

    const handleDeleteBot = useCallback(
        async (botId: number) => {
            try {
                const response = await request.deleteBot(botId)
                if (response) {
                    setBots(prevBots => prevBots?.filter(b => b.botId !== botId) ?? null)
                    toast({
                        variant: 'success',
                        title: 'Bot deleted successfully'
                    })
                    navigate('/bots')
                } else {
                    throw new Error('Failed to delete bot')
                }
            } catch (err) {
                toast({
                    variant: 'destructive',
                    title: 'Failed to delete bot',
                    description: err instanceof Error ? err.message : 'Unknown error occurred'
                })
                console.error(err)
            }
        },
        [request, toast, navigate]
    )

    const contextValue = {
        bots,
        handleDeleteBot,
        refetchBots: fetchBots
    }

    return <BotContext.Provider value={contextValue}>{children}</BotContext.Provider>
}

export const useBotContext = (): BotContextProps => {
    const context = useContext(BotContext)
    if (context === undefined) {
        throw new Error('useBotContext must be used within a BotProvider')
    }
    return context
}
