import { ChainType } from '@/types'
import { RpcNetwork } from '@/types'
import dev from './dev.json'
import prod from './prod.json'
import staging from './staging.json'

interface App {
    apiUrl: string
    taApiUrl: string
    wws: string
    infuraAPIKey: string
    networks: {
        [key in ChainType]: {
            chainId?: string
            chainName?: string
            rpcUrls?: string[]
            nativeCurrency?: {
                name: string
                symbol: string
                decimals: number
            }
            blockExplorerUrls?: string[]
        }
    }
}

export interface Config {
    app: App
    rpc: {
        bscTestnet: RpcNetwork
        bscMainnet: RpcNetwork
        ethMainnet: RpcNetwork
        ethTestnet: RpcNetwork
        bitcoinMainnet: RpcNetwork
        bitcoinTestnet: RpcNetwork
    }
    redirectToLoginPage: boolean
}

// Environment types
type NodeEnv = 'dev' | 'prod' | 'staging'

const configMap: Record<NodeEnv, Config> = {
    dev: dev as Config,
    prod: prod as Config,
    staging: staging as Config
}

class ConfigManager {
    private static instance: ConfigManager
    private readonly config: Config

    private constructor(env: NodeEnv) {
        this.config = configMap[env]
    }

    public static getInstance(): ConfigManager {
        if (!ConfigManager.instance) {
            const env = import.meta.env.VITE_NODE_ENV as NodeEnv
            if (!env || !configMap[env]) {
                throw new Error(`Unknown or missing environment: ${env}`)
            }
            ConfigManager.instance = new ConfigManager(env)
        }
        return ConfigManager.instance
    }

    public getConfig(): Config {
        return this.config
    }
}

export { ConfigManager }
export default ConfigManager.getInstance().getConfig()
