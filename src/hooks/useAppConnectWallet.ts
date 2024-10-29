/* eslint-disable @typescript-eslint/no-explicit-any */
import { MetamaskAppWallet, useConnector } from './useConnector'
// import { EInternalEvent, publish } from 'src/libs/event'
import { useEffect, useState } from 'react'
import config from '@/configs'
import { useSDK } from '@metamask/sdk-react'
import { toast } from '@/components/ui/use-toast'

export function useAppConnectWallet() {
    const { connectorHandlers } = useConnector()
    const { provider } = useSDK()

    const [isErrorNetwork, setIsErrorNetwork] = useState<boolean>(false)

    const getAvailableWallets = () => {
        const wallets = []
        wallets.push(MetamaskAppWallet)

        return wallets
    }

    const getWallet = (walletName: string) => {
        const availableWallets = getAvailableWallets()
        return availableWallets.find(wallet => wallet?.name === walletName)
    }

    useEffect(() => {
        if (!provider) return
        // handleWhenChangeNetworkEvm().then()

        const onChainChanged = () => {
            console.log(`[useAppConnectWallet] detect chain evm changed`)
            handleWhenChangeNetworkEvm()
        }
        const onAccountsChanged = (newAccounts: any) => {
            console.log(`[useAppConnectWallet] detect account evm changed`)
            console.log(newAccounts)
        }

        provider.on('chainChanged', onChainChanged)

        provider.on('accountsChanged', onAccountsChanged)
    }, [provider])

    async function handleWhenChangeNetworkEvm() {
        if (!provider) return
        const chainId = await provider.request({
            method: 'eth_chainId'
        })

        if (
            chainId &&
            Object.values(config.app.networks)
                .map(network => network.chainId)
                .includes(chainId as string)
        ) {
            setIsErrorNetwork(false)
        } else {
            setIsErrorNetwork(true)
        }
    }

    const onConnectSuccess = (
        walletName: string,
        walletAddress: string,
        walletChain: string | number
    ) => {
        console.log('[useAppConnectWallet] onConnectSuccess', {
            name: walletName,
            address: walletAddress,
            chainId: walletChain
        })
        // publish(EInternalEvent.CONNECTED_WALLET, {})
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const onConnectError = (error: any) => {
        console.error(`[useAppConnectWallet] on connect error: ${error.message}`, error)
        toast({
            variant: 'destructive',
            title: 'Error',
            description: error.message
        })
        // publish(EInternalEvent.CONNECTED_WALLET_ERROR, { error })
        // publish(EInternalEvent.LOGOUT, {})
    }

    const connectWallet = async (name: string, chainId: string) => {
        return connectorHandlers[name].connect(chainId, onConnectSuccess, onConnectError)
    }

    return { connectWallet, getAvailableWallets, getWallet, isErrorNetwork }
}
