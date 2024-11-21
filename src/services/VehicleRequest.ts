import BaseRequest from '@/services/BaseRequest'
import { AppResponse } from '@/types/response'
import { Vehicle, VehicleStatus } from '@/types/vehicle'
import { VehicleRequestPayload } from '@/types/request'

export default class VehicleRequest extends BaseRequest {
    async getVehicles() {
        return await this.get<AppResponse<Vehicle[]>>('/vehicles')
    }

    async createVehicle(data: VehicleRequestPayload) {
        return await this.post<AppResponse<Vehicle>>('/vehicles', data)
    }

    async updateVehicleStatus(id: string, status: VehicleStatus) {
        return await this.patch<AppResponse<Vehicle>>(`/vehicles/${id}/status`, { status })
    }

    async getVehicleById(id: string) {
        return await this.get<AppResponse<Vehicle>>(`/vehicles/${id}`)
    }
}
