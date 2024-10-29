import { Condition, Strategy } from './index'

type BotRequestBody = {
    strategy: Strategy
    conditions: Condition[]
}

type ListRequestParams = {
    page: number
    limit: number
    order: 'ASC' | 'DESC'
}

type WalletRequestParams = ListRequestParams

type BotActionsQueryParams = ListRequestParams

type WalletRequestBody = {
    network: string
}

export type { BotRequestBody, BotActionsQueryParams, WalletRequestParams, WalletRequestBody }
