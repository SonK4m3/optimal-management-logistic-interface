import AuthRequest from '@/services/AuthRequest'
import BotRequest from '@/services/BotRequest'
import ChainRequest from '@/services/ChainRequest'
import ExchangeRequest from '@/services/ExchangeRequest'
import WalletRequest from '@/services/WalletRequest'
import TARequest from '@/services/TARequest'

const RequestMap = {
    AuthRequest,
    BotRequest,
    ChainRequest,
    WalletRequest,
    TARequest,
    ExchangeRequest
} as const

type RequestClasses = typeof RequestMap

type RequestInstances = {
    [K in keyof RequestClasses]: InstanceType<RequestClasses[K]>
}

const instances: Partial<RequestInstances> = {}

class RequestFactory {
    static getRequest<K extends keyof RequestClasses>(classname: K): RequestInstances[K] {
        if (!instances[classname]) {
            instances[classname] = RequestFactory.createRequest(classname)
        }
        return instances[classname] as RequestInstances[K]
    }

    static createRequest<K extends keyof RequestClasses>(classname: K): RequestInstances[K] {
        const RequestClass = RequestMap[classname]
        if (!RequestClass) {
            throw new Error(`Request class "${classname}" not found in RequestMap.`)
        }
        return new RequestClass() as RequestInstances[K]
    }
}

export default RequestFactory
