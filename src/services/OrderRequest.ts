import BaseRequest from '@/services/BaseRequest.ts'
import { Order, OrderStatus } from '@/types/order'
import { AppResponse } from '@/types/response'

export default class OrderRequest extends BaseRequest {
    async createOrder(data: Order) {
        return await this.post<AppResponse<Order>>('/orders', data)
    }

    async patchOrder(id: string, data: Partial<Order>) {
        return await this.patch<AppResponse<Order>>(`/orders/${id}`, data)
    }

    async updateOrderStatus(id: string, status: OrderStatus) {
        return await this.patch<AppResponse<Order>>(`/orders/${id}/status?status=${status}`)
    }

    async getOrderById(id: string) {
        return await this.get<AppResponse<Order>>(`/orders/${id}`)
    }

    async deleteOrder(id: string) {
        return await this.delete<AppResponse<Order>>(`/orders/${id}`)
    }

    async getOrdersByUserId(userId: string) {
        return await this.get<AppResponse<Order[]>>(`/orders/user/${userId}`)
    }

    async getOrdersByStatus(status: string) {
        return await this.get<AppResponse<Order[]>>(`/orders/status/${status}`)
    }

    async getOrdersByDateRange(startDate: number, endDate: number) {
        return await this.get<AppResponse<Order[]>>(
            `/orders/date-range?startDate=${startDate}&endDate=${endDate}`
        )
    }
}
