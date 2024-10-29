/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react'
import { SUPPORTED_WALLETS } from '@/lib/constants'
import { switchNetwork } from '@/lib/metamask'
import { findChainConfigByChainId } from '@/lib/dapp-wallet'
import { TokenCurrency } from '@/types'
import { getTokenDecimals, sendERC20Token } from '@/lib/contracts/erc20'
import { useSDK } from '@metamask/sdk-react'
import { getAddress } from 'ethers'

export interface IAppWallet {
    name: string
    icon: string
}

export const MetamaskAppWallet: IAppWallet = {
    name: SUPPORTED_WALLETS.METAMASK_WALLET,
    icon: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSJZaVpfhv3kgZA46GoqfVNIFhR6pXIdX4_Rg&s'
}

type TUseConnector = () => IUseConnector
interface IConnecterHandler {
    provider: any
    isConnected: boolean
    currentChainId: string | undefined
    account: string | undefined
    switchNetwork: (chain: any) => void
    connect: (chainId: string, onConnectSuccess: any, onConnectError: any) => Promise<void>
    disconnect: () => Promise<void>
    signMessage: (
        message: string,
        onSignMessageSuccess: (signature: string) => void,
        onSignMessageError: (error: any) => void
    ) => Promise<void>
    sendToken: (data: {
        toAddress: string
        amount: string
        tokenCurrency: Omit<TokenCurrency, 'symbol'>
    }) => Promise<string>
    getTokenDecimals: (tokenAddress: string) => Promise<number>
}
export interface IUseConnector {
    isInitialize: boolean
    connectorHandlers: {
        [key: string]: IConnecterHandler
    }
}

export const useConnector: TUseConnector = () => {
    const [isInitialize, setIsInitialize] = useState<boolean>(false)
    const { sdk, provider, connected, chainId, account } = useSDK()

    useEffect(() => {
        setIsInitialize(!!sdk && !!provider)
    }, [sdk, provider])

    const connectorHandlers = {
        [SUPPORTED_WALLETS.METAMASK_WALLET]: {
            provider: provider,
            isConnected: connected,
            currentChainId: chainId,
            account,
            switchNetwork: switchNetwork.bind(null, provider),
            connect: async (chainId: string, onConnectSuccess: any, onConnectError: any) => {
                try {
                    const accounts = (await provider?.request({
                        method: 'eth_requestAccounts'
                    })) as string[]
                    if (accounts?.length === 0) {
                        throw new Error('No accounts found. User denied account access.')
                    } else {
                        const currentChainId = await provider?.request({ method: 'eth_chainId' })
                        if (currentChainId !== chainId) {
                            const chain = findChainConfigByChainId(chainId)
                            if (chain) {
                                throw new Error('Unsupported chain')
                            }

                            if (provider && chain) {
                                await switchNetwork(provider, chain)
                            }
                        }
                        onConnectSuccess &&
                            onConnectSuccess(
                                MetamaskAppWallet.name,
                                getAddress(accounts[0]),
                                chainId
                            )
                    }
                } catch (error) {
                    onConnectError && onConnectError(error)
                }
            },
            disconnect: async () => {
                await sdk?.terminate()
            },
            signMessage: async (
                message: string,
                onSignMessageSuccess: (signature: string) => void,
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                onSignMessageError: (error: any) => void
            ) => {
                try {
                    const signResult = await sdk?.connectAndSign({
                        msg: message
                    })
                    if (signResult) {
                        onSignMessageSuccess(signResult as string)
                    }
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                } catch (error: any) {
                    onSignMessageError(error)
                }
            },
            sendToken: async ({
                toAddress,
                tokenCurrency,
                amount
            }: {
                toAddress: string
                amount: string
                tokenCurrency: Omit<TokenCurrency, 'symbol'>
            }) => {
                if (!provider) throw new Error('Provider is not initialized')
                return await sendERC20Token(provider, toAddress, amount, tokenCurrency)
            },
            getTokenDecimals: async (tokenAddress: string) => {
                if (!provider) throw new Error('Provider is not initialized')
                const bigIntDecimals = await getTokenDecimals(provider, tokenAddress)
                return Number(bigIntDecimals)
            }
        }
    }

    return {
        isInitialize,
        connectorHandlers
    }
}
