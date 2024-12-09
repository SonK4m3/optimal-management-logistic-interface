import BaseRequest from '@/services/BaseRequest.ts'
import {
    Warehouse,
    Receipt,
    CheckWarehouseSpace,
    StorageLocation,
    StorageLocationType
} from '@/types/warehouse'
import { AppResponse, DocsResponseWithPagination } from '@/types/response'
import {
    ReceiptRequestPayload,
    WarehouseRequestPayload,
    StorageLocationRequestPayload
} from '@/types/request'

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
        return await this.get<AppResponse<DocsResponseWithPagination<Warehouse>>>('/warehouses')
    }

    async getReceipts(params: { warehouseId?: string; page?: number; size?: number }) {
        if (params.warehouseId) {
            return await this.get<AppResponse<DocsResponseWithPagination<Receipt>>>(
                `/warehouses/receipts?warehouseId=${params.warehouseId}&page=${params.page}&size=${params.size}`
            )
        }

        return await this.get<AppResponse<DocsResponseWithPagination<Receipt>>>(
            `/warehouses/receipts?page=${params.page}&size=${params.size}`
        )
    }

    async createReceipt(warehouseId: string, data: ReceiptRequestPayload) {
        return await this.post<AppResponse<Receipt>>(`/warehouses/${warehouseId}/receipts`, data)
    }

    async confirmReceipt(id: number) {
        return await this.put<AppResponse<Receipt>>(`/warehouses/receipts/${id}/confirm`)
    }

    async rejectReceipt(id: number) {
        return await this.put<AppResponse<Receipt>>(`/warehouses/receipts/${id}/reject`)
    }

    async checkWarehouseSpace(warehouseId: string) {
        return await this.get<AppResponse<CheckWarehouseSpace>>(`/warehouses/${warehouseId}/space`)
    }

    async createStorageLocation(data: StorageLocationRequestPayload) {
        return await this.post<AppResponse<StorageLocation>>(`/storage-locations`, data)
    }

    async findAvailableStorageLocations(params: {
        warehouseId: number
        requiredWeight: number
        preferredType: StorageLocationType
        minHeight: number
        minWidth: number
        minLength: number
    }) {
        return await this.post<AppResponse<StorageLocation[]>>(
            `/storage-locations/find-available`,
            params
        )
    }

    async getStorageLocationsByWarehouse(warehouseId: string) {
        return await this.get<AppResponse<StorageLocation[]>>(
            `/storage-locations/warehouse/${warehouseId}`
        )
    }
}
