import { AppResponse } from '@/types/response'
import { StorageArea, StorageAreaType } from '@/types/warehouse'
import BaseRequest from './BaseRequest'

export default class StorageAreaRequest extends BaseRequest {
    async createStorageArea(payload: {
        warehouseId: number
        name: string
        type: StorageAreaType
        area: number
    }) {
        return await this.post<AppResponse<StorageArea>>('/storage-areas', payload)
    }

    async deactivateStorageArea(id: string) {
        return await this.put<AppResponse<string>>(`/storage-areas/${id}/deactivate`)
    }

    async getStorageAreaById(id: string) {
        return await this.get<AppResponse<StorageArea>>(`/storage-areas/${id}`)
    }

    async getStorageAreasByWarehouse(warehouseId: string) {
        return await this.get<AppResponse<StorageArea[]>>(`/storage-areas/warehouse/${warehouseId}`)
    }

    async getStorageAreasByType(warehouseId: string, type: string) {
        return await this.get<AppResponse<StorageArea[]>>(
            `/storage-areas/warehouse/${warehouseId}/type/${type}`
        )
    }

    async getAvailableStorageAreas(warehouseId: string) {
        return await this.get<AppResponse<StorageArea[]>>(
            `/storage-areas/warehouse/${warehouseId}/available`
        )
    }
}
