import AuthRequest from '@/services/AuthRequest'
import VRPRequest from '@/services/VRPRequest'
import OrderRequest from '@/services/OrderRequest'
import WarehouseRequest from '@/services/WarehouseRequest'
import DriverRequest from '@/services/DriverRequest'
import VehicleRequest from '@/services/VehicleRequest'
import ResourceRequest from '@/services/ResourceRequest'
import TaskRequest from '@/services/TaskRequest'
import ShiftRequest from '@/services/ShiftRequest'
import ProductRequest from '@/services/ProductRequest'
import InventoryRequest from '@/services/InventoryRequest'
import StorageAreaRequest from '@/services/StorageAreaRequest'
import ShipmentRequest from '@/services/ShipmentRequest'
import DeliveryRequest from '@/services/DeliveryRequest'
const RequestMap = {
    AuthRequest,
    VRPRequest,
    OrderRequest,
    WarehouseRequest,
    DriverRequest,
    VehicleRequest,
    ResourceRequest,
    TaskRequest,
    ShiftRequest,
    ProductRequest,
    InventoryRequest,
    StorageAreaRequest,
    ShipmentRequest,
    DeliveryRequest
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
