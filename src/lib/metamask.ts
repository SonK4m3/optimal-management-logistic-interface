import { SDKProvider } from '@metamask/sdk'

export const switchNetwork = async (
    provider: SDKProvider | undefined,
    chain: {
        chainId: string
        chainName: string
        blockExplorerUrls: string[]
        nativeCurrency: { name: string; symbol: string; decimals: number }
        rpcUrls: string[]
    }
) => {
    if (!provider) return

    try {
        const resp = await provider.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: chain.chainId }] // Check networks.js for hexadecimal network ids
        })
        console.log('[switchNetwork]', resp)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
        if (e.code === 4902 || e?.data?.originalError?.code === 4902) {
            await addNetwork(provider, chain)
        }
    }
}

export const addNetwork = async (
    provider: SDKProvider,
    chain: {
        chainId: string
        chainName: string
        blockExplorerUrls: string[]
        nativeCurrency: { name: string; symbol: string; decimals: number }
        rpcUrls: string[]
    }
) => {
    try {
        console.log('[addNetwork]', chain)
        const resp = await provider.request({
            method: 'wallet_addEthereumChain',
            params: [chain]
        })
        console.log('[addNetwork]', resp)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
        console.error('[addNetwork]', e)
    }
}
