import BaseRequest from '@/services/BaseRequest.ts'
import { Driver, DriverStatus, DeliveryAssignment } from '@/types/driver'
import { AppResponse, DocsResponseWithPagination } from '@/types/response'
import { DriverRequestPayload, CreateDriverByManagerRequestPayload } from '@/types/request'
import { DeliveryStatus } from '@/types/order'

export default class DriverRequest extends BaseRequest {
    async createDriver(data: DriverRequestPayload) {
        return await this.post<AppResponse<Driver>>('/drivers', data)
    }

    async createDriverByManager(data: CreateDriverByManagerRequestPayload) {
        return await this.post<AppResponse<Driver>>('/drivers/manager', data)
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
        return await this.get<AppResponse<DocsResponseWithPagination<Driver>>>(`/drivers/all`)
    }

    async updateDriverLocation(id: number, data: { latitude: number; longitude: number }) {
        return await this.patch<AppResponse<Driver>>(
            `/drivers/${id}/location?latitude=${data.latitude}&longitude=${data.longitude}`
        )
    }

    async findDriver(deliveryId: string) {
        return await this.post<AppResponse<Driver>>(`/drivers/${deliveryId}/find-driver`)
    }

    async updateDriverStatus(id: number, status: DriverStatus) {
        return await this.patch<AppResponse<Driver>>(`/drivers/${id}/status?status=${status}`)
    }

    async assignDriverToDelivery(data: {
        deliveryId: string
        driverId: string
        warehouseIds: number[]
    }) {
        return await this.post<AppResponse<DeliveryAssignment>>(`/driver-deliveries`, data)
    }

    async getDeliveryAssignmentsByDriverId(driverId: string) {
        return await this.get<AppResponse<DeliveryAssignment[]>>(
            `/driver-deliveries/driver/${driverId}`
        )
    }

    async updateDeliveryAssignmentStatus(params: {
        deliveryId: number
        driverId: string
        newStatus: DeliveryStatus
    }) {
        return await this.post<AppResponse<DeliveryAssignment>>(
            `/driver-deliveries/status?driverId=${params.driverId}&newStatus=${params.newStatus}&deliveryId=${params.deliveryId}`,
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        )
    }

    async updateDeliveryAssignmentRejectionReason(params: {
        deliveryId: number
        driverId: string
        reason: string
    }) {
        return await this.post<AppResponse<DeliveryAssignment>>(
            `/driver-deliveries/reject?driverId=${params.driverId}&reason=${params.reason}&deliveryId=${params.deliveryId}`,
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        )
    }

    async updateAcceptedDeliveryAssignment(params: { deliveryId: number; driverId: string }) {
        return await this.post<AppResponse<DeliveryAssignment>>(
            `/driver-deliveries/accept?driverId=${params.driverId}&deliveryId=${params.deliveryId}`
        )
    }

    async getAvailableDrivers(deliveryId: string) {
        return await this.get<AppResponse<Driver[]>>(`/drivers/available-drivers/${deliveryId}`)
    }

    async startDriverAssignment(assignmentId: string) {
        return await this.post<AppResponse<DeliveryAssignment>>(
            `/driver-deliveries/start/${assignmentId}`
        )
    }

    async endDriverAssignment(assignmentId: string) {
        return await this.post<AppResponse<DeliveryAssignment>>(
            `/driver-deliveries/deliver/${assignmentId}`
        )
    }

    async refreshDeliveryAssignments(params: { driverId: string }) {
        return await this.get<AppResponse<DeliveryAssignment[]>>(
            `/driver-deliveries/refresh?driverId=${params.driverId}`
        )
    }

    async getDriverByUserId(userId: string) {
        return await this.get<AppResponse<Driver>>(`/drivers/user/${userId}`)
    }
}
