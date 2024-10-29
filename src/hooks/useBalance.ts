import { useState, useEffect, useCallback } from 'react'
import { JsonRpcProvider } from '@ethersproject/providers'
import { erc20Contract } from '@/lib/contract'
import { convertWeiToDec } from '@/lib/utils'
import configs from '@/configs'
import { ChainType, RpcNetwork } from '@/types'

interface UseBalanceProps {
    network: ChainType
    tokenAddress: string
    walletAddress: string
}

interface TokenInfo {
    balance: string | null
    symbol: string | null
    name: string | null
}

const RPC_URL: Record<ChainType, RpcNetwork> = {
    BITCOIN_MAINNET: configs.rpc.bitcoinMainnet,
    BITCOIN_TESTNET: configs.rpc.bitcoinTestnet,
    BSC_MAINNET: configs.rpc.bscMainnet,
    BSC_TESTNET: configs.rpc.bscTestnet,
    ETH_MAINNET: configs.rpc.ethMainnet,
    ETH_TESTNET: configs.rpc.ethTestnet
}

const useBalance = ({ network, tokenAddress, walletAddress }: UseBalanceProps) => {
    const [tokenInfo, setTokenInfo] = useState<TokenInfo>({
        balance: null,
        symbol: null,
        name: null
    })
    const [error, setError] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [abortController, setAbortController] = useState<AbortController | null>(null)

    const fetchTokenInfo = useCallback(async () => {
        if (!walletAddress || !tokenAddress || !network) {
            setTokenInfo({ balance: null, symbol: null, name: null })
            return
        }

        if (abortController) {
            abortController.abort()
        }

        const newAbortController = new AbortController()
        setAbortController(newAbortController)

        setIsLoading(true)
        setTokenInfo({ balance: null, symbol: null, name: null })
        setError(null)

        try {
            const provider = new JsonRpcProvider(RPC_URL[network].url)
            const tokenContract = erc20Contract(tokenAddress, provider)

            const [tokenBalance, tokenDecimals, tokenSymbol, tokenName] = await Promise.all([
                tokenContract.balanceOf(walletAddress),
                tokenContract.decimals(),
                tokenContract.symbol(),
                tokenContract.name()
            ])

            if (newAbortController.signal.aborted) {
                return
            }

            setTokenInfo({
                balance: convertWeiToDec(tokenBalance, tokenDecimals),
                symbol: tokenSymbol,
                name: tokenName
            })
        } catch (err: unknown) {
            if (!newAbortController.signal.aborted) {
                setTokenInfo({ balance: null, name: null, symbol: null })
                setError(err instanceof Error ? err.message : 'An unknown error occurred')
            }
        } finally {
            setIsLoading(false)
            setAbortController(null)
        }
    }, [walletAddress, tokenAddress, network])

    useEffect(() => {
        fetchTokenInfo()

        return () => {
            if (abortController) {
                abortController.abort()
            }
        }
    }, [fetchTokenInfo])

    return { ...tokenInfo, error, isLoading, refetch: fetchTokenInfo }
}

export default useBalance
