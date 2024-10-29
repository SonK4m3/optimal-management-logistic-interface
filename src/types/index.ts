import {
    BBPercentBConditionName,
    BBPercentBConditionType,
    MAConditionName,
    MAConditionType,
    SimpleConditionType,
    SimpleIndicatorName
} from '@/types/enum'

interface ITelegramUser {
    id: number
    first_name: string
    last_name?: string
    username?: string
    language_code?: string
    photo_url?: string
}

interface IWebApp {
    ready: () => void
    initData: string
    initDataUnsafe: {
        query_id: string
        user: ITelegramUser
        auth_date: string
        hash: string
    }
    version: string
    platform: string
    colorScheme: string
    themeParams: {
        link_color: string
        button_color: string
        button_text_color: string
        secondary_bg_color: string
        hint_color: string
        bg_color: string
        text_color: string
    }
    isExpanded: boolean
    viewportHeight: number
    viewportStableHeight: number
    isClosingConfirmationEnabled: boolean
    headerColor: string
    backgroundColor: string
    BackButton: {
        isVisible: boolean
    }
    MainButton: {
        text: string
        color: string
        textColor: string
        isVisible: boolean
        isProgressVisible: boolean
        isActive: boolean
    }
    HapticFeedback: unknown
}

type ChainType =
    | 'BITCOIN_MAINNET'
    | 'BITCOIN_TESTNET'
    | 'BSC_MAINNET'
    | 'BSC_TESTNET'
    | 'ETH_MAINNET'
    | 'ETH_TESTNET'

type Operator =
    | 'GREATER_THAN'
    | 'LESS_THAN'
    | 'EQUAL'
    | 'GREATER_THAN_OR_EQUAL'
    | 'LESS_THAN_OR_EQUAL'
    | 'CROSSING_UP'
    | 'CROSSING_DOWN'

type Strategy = {
    poolId: string
    walletAddress: string
    baseAddress: string
    quoteAddress: string
    orderSide: 'BUY' | 'SELL'
    orderType: 'MARKET' | 'LIMIT'
    // baseOrderCurrency: 'BTC' | 'USDT'
    orderSize: number
    network: ChainType
    exchange: string
    takeProfitPercentage: number
    stopLossPercentage: number
}

type CreateBotFormValues = {
    poolName: string
    poolId: string
    walletAddress: string
    baseAddress: string
    quoteAddress: string
    orderSide: 'BUY' | 'SELL'
    orderType: 'MARKET' | 'LIMIT'
    baseOrderCurrency: 'BTC' | 'USDT'
    orderSize: number
    network: ChainType
    exchange: string
    takeProfitPercentage: number
    stopLossPercentage: number
    conditions: Condition[]
}

type InputFieldNames<T> = {
    [K in keyof T]: T[K] extends string | number ? K : never
}[keyof T]

type BaseCondition = {
    pair: string
    indicatorName: SimpleIndicatorName | MAConditionName | BBPercentBConditionName
    conditionType: SimpleConditionType | MAConditionType | BBPercentBConditionType
    timeFrame: string
    operator: Operator
}

type BBCondition = BaseCondition & {
    period: number
    multiplier: number
    signalValue: number
}

type RSICondition = BaseCondition & {
    period: number
    signalValue: number
}

type MACondition = BaseCondition & {
    fastPeriod: number
    slowPeriod: number
}

type Condition = BBCondition | RSICondition | MACondition

type Bot = {
    botId: number
    strategy: Strategy
    conditions: Condition[]
}

type BotAction = {
    action: string
    createdAt: string
}

type OAuthConfig = {
    name: string
    connectMethod: () => void
    disconnectMethod: () => void
}

type User = {
    id: string
    name: string
    email: string
    picture: string
}

type OAuthProvider = 'GOOGLE' | 'FACEBOOK' // Add more providers as needed

type Pool = {
    poolId: string
    poolSymbol: string
    baseAddress: string
    quoteAddress: string
}

type Chain = {
    name: ChainType
    pools: Pool[]
}

type TA = {
    indicatorName: string
    cacheKey: string
    values: string
    timeStamp: number
    takey: string
}

type IndicatorFormValue = {
    indicatorName: string
    period: number
    timeFrame: string
    multiplier: number
}
type Wallet = {
    walletAddress: string
    network: ChainType
    walletType: number
    privateKey: string
}

type TokenCurrency = { symbol: string; address: string; decimals: number }

type RpcNetwork = {
    url: string
    nativeDecimals: number
}

export type {
    ITelegramUser,
    IWebApp,
    CreateBotFormValues,
    InputFieldNames,
    Bot,
    Condition,
    MACondition,
    BBCondition,
    Strategy,
    BaseCondition,
    RSICondition,
    BotAction,
    OAuthConfig,
    OAuthProvider,
    User,
    Chain,
    TA,
    IndicatorFormValue,
    Wallet,
    ChainType,
    TokenCurrency,
    RpcNetwork
}
