import BaseRequest from '@/services/BaseRequest.ts'
import { Warehouse } from '@/types/warehouse'
import { AppResponse } from '@/types/response'
import { WarehouseRequestPayload } from '@/types/request'
export default class WarehouseRequest extends BaseRequest {
    async createWarehouse(data: WarehouseRequestPayload) {
        return await this.post<AppResponse<Warehouse>>('/warehouses', data)
    }

    async patchWarehouse(id: string, data: Partial<Warehouse>) {
        return await this.patch<AppResponse<Warehouse>>(`/warehouses/${id}`, data)
    }

    async getWarehouseById(id: string) {
        return await this.get<AppResponse<Warehouse>>(`/warehouses/${id}`)
    }

    async deleteWarehouse(id: string) {
        return await this.delete<AppResponse<Warehouse>>(`/warehouses/${id}`)
    }

    async getWarehousesByUserId(userId: string) {
        return await this.get<AppResponse<Warehouse[]>>(`/warehouses/user/${userId}`)
    }

    async getWarehousesByStatus(status: string) {
        return await this.get<AppResponse<Warehouse[]>>(`/warehouses/status/${status}`)
    }

    async getWarehousesByDateRange(startDate: number, endDate: number) {
        return await this.get<AppResponse<Warehouse[]>>(
            `/warehouses/date-range?startDate=${startDate}&endDate=${endDate}`
        )
    }

    async getWarehouses() {
        return await this.get<AppResponse<Warehouse[]>>('/warehouses')
    }
}
