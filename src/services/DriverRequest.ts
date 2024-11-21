import BaseRequest from '@/services/BaseRequest.ts'
import { Driver } from '@/types/driver'
import { AppResponse } from '@/types/response'
import { DriverRequestPayload } from '@/types/request'

export default class DriverRequest extends BaseRequest {
    async createDriver(data: DriverRequestPayload) {
        return await this.post<AppResponse<Driver>>('/drivers', data)
    }

    async patchDriver(id: string, data: Partial<Driver>) {
        return await this.patch<AppResponse<Driver>>(`/drivers/${id}`, data)
    }

    async getDriverById(id: string) {
        return await this.get<AppResponse<Driver>>(`/drivers/${id}`)
    }

    async deleteDriver(id: string) {
        return await this.delete<AppResponse<Driver>>(`/drivers/${id}`)
    }

    async getDriversByUserId(userId: string) {
        return await this.get<AppResponse<Driver[]>>(`/drivers/user/${userId}`)
    }

    async getDriversByStatus(status: string) {
        return await this.get<AppResponse<Driver[]>>(`/drivers/status/${status}`)
    }

    async getDriversByDateRange(startDate: number, endDate: number) {
        return await this.get<AppResponse<Driver[]>>(
            `/drivers/date-range?startDate=${startDate}&endDate=${endDate}`
        )
    }

    async getDrivers() {
        return await this.get<AppResponse<Driver[]>>(`/drivers/all`)
    }

    async updateDriverLocation(id: number, data: { latitude: number; longitude: number }) {
        return await this.patch<AppResponse<Driver>>(
            `/drivers/${id}/location?latitude=${data.latitude}&longitude=${data.longitude}`
        )
    }
}
