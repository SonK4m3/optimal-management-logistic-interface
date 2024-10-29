import AuthRequest from '@/services/AuthRequest'
import VRPRequest from '@/services/VRPRequest'
import OrderRequest from '@/services/OrderRequest'

const RequestMap = {
    AuthRequest,
    VRPRequest,
    OrderRequest
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

    private static createRequest<K extends keyof RequestClasses>(
        classname: K
    ): RequestInstances[K] {
        const RequestClass = RequestMap[classname]
        if (!RequestClass) {
            throw new Error(`Request class "${classname}" not found in RequestMap.`)
        }
        return new RequestClass() as RequestInstances[K]
    }
}

export default RequestFactory
