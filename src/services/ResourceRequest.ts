import { AppResponse } from '@/types/response'
import BaseRequest from './BaseRequest'
import { Staff, Customer, Shift, Task } from '@/types/resource'
export default class ResourceRequest extends BaseRequest {
    async getAllStaffs() {
        return await this.get<AppResponse<Staff[]>>('/resources/staffs')
    }

    async getAllCustomers() {
        return await this.get<AppResponse<Customer[]>>('/resources/customers')
    }

    async updateCustomerInfo(payload: {
        id: number
        info: {
            phone: string
            address: {
                address: string
                city: string
                country: string
                isDefault: boolean
                addressType: string
                recipientInfo: string
            }
        }
    }) {
        return await this.put<AppResponse<Customer>>(
            `/resources/customer/${payload.id}/info`,
            payload.info
        )
    }

    async updateStaffInfo(payload: {
        id: number
        position: 'ADMIN' | 'DRIVER' | 'MANAGER' | 'CUSTOMER' | 'STAFF'
    }) {
        return await this.put<AppResponse<Staff>>(`/resources/staff/${payload.id}/info`, {
            position: payload.position
        })
    }

    async getAllShifts() {
        return await this.get<AppResponse<Shift[]>>('/resources/shifts')
    }

    async getAllTasks() {
        return await this.get<AppResponse<Task[]>>('/resources/tasks')
    }

    async getCustomerById(userId: number) {
        return await this.get<AppResponse<Customer>>(`/resources/customer/${userId}`)
    }

    async createCustomerAddress(data: {
        customerId: number
        payload: {
            address: string
            latitude: number
            longitude: number
            isDefault: boolean
        }
    }) {
        return await this.post<AppResponse<Customer>>(
            `/resources/customer/${data.customerId}/addresses`,
            data.payload
        )
    }
}
