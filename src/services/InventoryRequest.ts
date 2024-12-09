import BaseRequest from '@/services/BaseRequest'
import { Inventory } from '@/types/inventory'
import { AppResponse, DocsResponseWithPagination } from '@/types/response'

export default class InventoryRequest extends BaseRequest {
    async getInventories(params: { page?: number; size?: number }) {
        return this.get<AppResponse<DocsResponseWithPagination<Inventory>>>(
            `/inventories?page=${params.page}&size=${params.size}`
        )
    }

    async getInventory(id: string) {
        return this.get(`/inventories/${id}`)
    }

    async createInventory(data: Inventory) {
        return this.post('/inventories', data)
    }

    async getInventoryByWarehouse(warehouseId: string) {
        return this.get<AppResponse<Inventory[]>>(`/inventories/warehouse/${warehouseId}`)
    }
}
