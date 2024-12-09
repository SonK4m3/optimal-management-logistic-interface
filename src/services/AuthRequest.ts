import BaseRequest from '@/services/BaseRequest.ts'
import { AppResponse, LoginResponse } from '@/types/response'

export default class AuthRequest extends BaseRequest {
    async register(data: {
        username: string
        email: string
        password: string
        fullName: string
        role: 'ADMIN' | 'CUSTOMER' | 'STAFF' | 'DRIVER'
    }): Promise<AppResponse<string>> {
        const url = `/auth/register`
        return this.post<AppResponse<string>>(url, data)
    }

    async login(username: string, password: string): Promise<AppResponse<LoginResponse>> {
        const url = `/auth/login`
        return this.post<AppResponse<LoginResponse>>(url, { username, password })
    }

    async logout(): Promise<AppResponse<void>> {
        const url = `/auth/logout`
        return this.post<AppResponse<void>>(url, {})
    }
}
