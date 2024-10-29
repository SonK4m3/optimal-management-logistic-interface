import { useState, useEffect, useCallback } from 'react'
import { JsonRpcProvider } from '@ethersproject/providers'
import { convertWeiToDec } from '@/lib/utils'
import configs from '@/configs'
import { ChainType, RpcNetwork } from '@/types'

interface UseNativeBalanceProps {
    network: ChainType
    walletAddress: string
}

const RPC_URL: Record<ChainType, RpcNetwork> = {
    BITCOIN_MAINNET: configs.rpc.bitcoinMainnet,
    BITCOIN_TESTNET: configs.rpc.bitcoinTestnet,
    BSC_MAINNET: configs.rpc.bscMainnet,
    BSC_TESTNET: configs.rpc.bscTestnet,
    ETH_MAINNET: configs.rpc.ethMainnet,
    ETH_TESTNET: configs.rpc.ethTestnet
}

const NATIVE_TOKEN_SYMBOLS: Record<ChainType, string> = {
    BITCOIN_MAINNET: 'BTC',
    BITCOIN_TESTNET: 'tBTC',
    BSC_MAINNET: 'BNB',
    BSC_TESTNET: 'tBNB',
    ETH_MAINNET: 'ETH',
    ETH_TESTNET: 'tETH'
}

const useNativeBalance = ({ network, walletAddress }: UseNativeBalanceProps) => {
    const [balance, setBalance] = useState<string | null>(null)
    const [error, setError] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [abortController, setAbortController] = useState<AbortController | null>(null)

    const fetchNativeBalance = useCallback(async () => {
        if (!network) {
            setBalance(null)
            return
        }

        if (abortController) {
            abortController.abort()
        }

        const newAbortController = new AbortController()
        setAbortController(newAbortController)

        setIsLoading(true)
        setBalance(null)
        setError(null)

        try {
            const provider = new JsonRpcProvider(RPC_URL[network].url)
            const nativeBalance = await provider.getBalance(walletAddress)

            if (newAbortController.signal.aborted) {
                return
            }

            setBalance(convertWeiToDec(nativeBalance.toString(), RPC_URL[network].nativeDecimals))
        } catch (err: unknown) {
            if (!newAbortController.signal.aborted) {
                setBalance(null)
                setError(err instanceof Error ? err.message : 'An unknown error occurred')
            }
        } finally {
            setIsLoading(false)
            setAbortController(null)
        }
    }, [network, walletAddress])

    useEffect(() => {
        fetchNativeBalance()

        return () => {
            if (abortController) {
                abortController.abort()
            }
        }
    }, [fetchNativeBalance])

    return {
        balance,
        symbol: NATIVE_TOKEN_SYMBOLS[network],
        name: NATIVE_TOKEN_SYMBOLS[network],
        error,
        isLoading,
        refetch: fetchNativeBalance
    }
}

export default useNativeBalance
