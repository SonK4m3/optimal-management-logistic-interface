import React, { createContext, useCallback, useContext, useEffect, useState } from 'react'
import RequestFactory from '@/services/RequestFactory.ts'
import { useToast } from '@/components/ui/use-toast.ts'
import { Wallet } from '@/types'
import { WalletRequestParams } from '@/types/request'
import { useAuthContext } from './AuthContext'

interface WalletContextProps {
    myWallets: Wallet[] | null | undefined
    generateWallet: (network: string) => Promise<void>
    currentPage: number
    totalPages: number
    limit: number
    handleNextPage: () => void
    handlePreviousPage: () => void
    handlePageChange: (page: number) => void
}

const CreateWalletContext = createContext<WalletContextProps | undefined>(undefined)

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const request = RequestFactory.getRequest('WalletRequest')
    const { toast } = useToast()
    const { isLogin } = useAuthContext()

    const [myWallets, setMyWallets] = useState<Wallet[] | null | undefined>(undefined)
    const [currentPage, setCurrentPage] = useState<number>(1)
    const [totalPages, setTotalPages] = useState<number>(1)
    const [limit, setLimit] = useState<number>(20)
    const generateWallet = async (network: string) => {
        try {
            const response = await request.createWallet({
                network
            })
            if (response && response.walletAddress) {
                toast({
                    variant: 'success',
                    title: 'Wallet Generated Successfully',
                    description: `Your wallet address is: ${response.walletAddress}`
                })
                fetchMyWallets()
            } else {
                toast({
                    variant: 'destructive',
                    title: 'Wallet Generation Failed'
                })
            }
        } catch (error) {
            console.error('Error generating wallet:', error)
            toast({
                variant: 'destructive',
                title: 'Error',
                description: 'An error occurred while generating the wallet.'
            })
        }
    }

    const fetchMyWallets = useCallback(
        async (page: number = 1) => {
            try {
                const params: WalletRequestParams = {
                    page,
                    limit,
                    order: 'ASC'
                }

                const response = await request.getWallet(params)
                if (response && response.docs) {
                    setMyWallets(response.docs)
                    setCurrentPage(response.page)
                    setTotalPages(response.totalPages)
                    setLimit(response.limit)
                } else {
                    setMyWallets(null)
                }
            } catch (error) {
                console.error('Error fetching my wallets:', error)
                setMyWallets(null)
            }
        },
        [limit, request]
    )

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            fetchMyWallets(currentPage + 1)
        }
    }

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            fetchMyWallets(currentPage - 1)
        }
    }

    const handlePageChange = (page: number) => {
        fetchMyWallets(page)
    }

    useEffect(() => {
        if (isLogin) {
            fetchMyWallets()
        }
    }, [fetchMyWallets, isLogin])

    return (
        <CreateWalletContext.Provider
            value={{
                myWallets,
                generateWallet,
                currentPage,
                totalPages,
                limit,
                handleNextPage,
                handlePreviousPage,
                handlePageChange
            }}
        >
            {children}
        </CreateWalletContext.Provider>
    )
}

export const useWalletContext = (): WalletContextProps => {
    const context = useContext(CreateWalletContext)
    if (context === undefined) {
        throw new Error('useWalletContext must be used within a WalletProvider')
    }
    return context
}
