import BaseRequest from './BaseRequest'
import { ShipmentRequestPayload } from '@/types/request'
import { Shipment } from '@/types/shipment'
import { AppResponse, DocsResponseWithPagination } from '@/types/response'

export default class ShipmentRequest extends BaseRequest {
    async getShipments(params: { page: number; size: number }) {
        return this.get<AppResponse<DocsResponseWithPagination<Shipment>>>(
            `/shipments/?page=${params.page}&size=${params.size}`
        )
    }

    async createShipment(data: ShipmentRequestPayload) {
        return this.post<AppResponse<Shipment>>('/shipments/create', data)
    }

    async confirmShipment(id: string) {
        return this.put<AppResponse<Shipment>>(`/shipments/${id}/confirm`)
    }

    async cancelShipment(id: string) {
        return this.put<AppResponse<Shipment>>(`/shipments/${id}/cancel`)
    }
}
