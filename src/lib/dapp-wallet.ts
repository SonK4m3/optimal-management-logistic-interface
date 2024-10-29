import configs from '@/configs'
import { CHAINS, SUPPORTED_WALLETS } from '@/lib/constants'
import { ChainType } from '@/types'

export const getDappWalletByChain = (chain: ChainType) => {
    if ([CHAINS.BITCOIN_MAINNET, CHAINS.BITCOIN_TESTNET].includes(chain)) {
        return SUPPORTED_WALLETS.UNISAT_WALLET
    }

    if (
        [CHAINS.BSC_MAINNET, CHAINS.BSC_TESTNET, CHAINS.ETH_MAINNET, CHAINS.ETH_TESTNET].includes(
            chain
        )
    ) {
        return SUPPORTED_WALLETS.METAMASK_WALLET
    }

    throw new Error('Unsupported chain: ' + chain)
}

export const findChainConfigByChainId = (chainId: string) => {
    const network = Object.values(configs.app.networks).find(network => network.chainId === chainId)
    return network
}
