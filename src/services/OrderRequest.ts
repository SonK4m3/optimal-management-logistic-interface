import BaseRequest from '@/services/BaseRequest.ts'
import { Delivery, Order, OrderStatus } from '@/types/order'
import { OrderRequestPayload, PaginationParams } from '@/types/request'
import { AppResponse, DocsResponseWithPagination } from '@/types/response'

export default class OrderRequest extends BaseRequest {
    async createOrder(data: OrderRequestPayload) {
        return await this.post<AppResponse<Order>>('/orders', data)
    }

    async patchOrder(id: number, data: Partial<Order>) {
        return await this.patch<AppResponse<Order>>(`/orders/${id}`, data)
    }

    async updateOrderStatus(id: number, status: OrderStatus) {
        return await this.patch<AppResponse<Order>>(`/orders/${id}/status?status=${status}`)
    }

    async getOrderById(id: number) {
        return await this.get<AppResponse<Order>>(`/orders/${id}`)
    }

    async deleteOrder(id: number) {
        return await this.delete<AppResponse<Order>>(`/orders/${id}`)
    }

    async getOrdersByUserId(userId: number) {
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

    async getOdersByUser({ page = 1, limit = 10 }: PaginationParams) {
        return await this.get<AppResponse<DocsResponseWithPagination<Order>>>(
            `/orders/user?page=${page}&limit=${limit}`
        )
    }

    async acceptOrderForDelivery(payload: { orderId: number; driverId: number }) {
        return await this.post<AppResponse<Delivery>>(
            `/orders/${payload.driverId}/accept-order/${payload.orderId}`
        )
    }

    async rejectOrderForDelivery(payload: { orderId: number; driverId: number }) {
        return await this.post<AppResponse<Delivery>>(
            `/orders/${payload.driverId}/reject-order/${payload.orderId}`
        )
    }

    async inTransit(driverId: number) {
        return await this.get<AppResponse<Delivery[]>>(`/deliveries/${driverId}/in-transit`)
    }

    async completeDelivery(payload: { deliveryId: number; driverId: number }) {
        return await this.post<AppResponse<Delivery>>(
            `/deliveries/${payload.driverId}/complete-delivery/${payload.deliveryId}`
        )
    }

    async rejectDelivery(payload: { deliveryId: number; driverId: number }) {
        return await this.post<AppResponse<Delivery>>(
            `/deliveries/${payload.driverId}/reject-delivery/${payload.deliveryId}`
        )
    }
}
