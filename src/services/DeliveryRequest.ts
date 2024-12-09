import { AppResponse } from '@/types/response'
import BaseRequest from './BaseRequest'
import { Delivery } from '@/types/order'
import { WarehouseDriver } from '@/types/driver'

export default class DeliveryRequest extends BaseRequest {
    async getDeliveryOrder(orderId: string) {
        return await this.get<AppResponse<Delivery>>(`/deliveries/order/${orderId}`)
    }

    async suggestDriver(data: { deliveryId: string; driverNumber: number; driverIds: number[] }) {
        return await this.post<AppResponse<{ warehouseDrivers: WarehouseDriver[] }>>(
            `/deliveries/suggest-drivers`,
            data
        )
    }

    async suggestDriverVrp(data: {
        deliveryId: string
        driverNumber: number
        driverIds: number[]
    }) {
        return await this.post<AppResponse<{ warehouseDrivers: WarehouseDriver[] }>>(
            `/deliveries/suggest-drivers-vrp`,
            data
        )
    }

    async getDeliveryById(deliveryId: string) {
        return await this.get<AppResponse<Delivery>>(`/deliveries/${deliveryId}`)
    }
}
