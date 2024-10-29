import BaseRequest from '@/services/BaseRequest.ts'

export default class AuthRequest extends BaseRequest {
    async register(
        username: string,
        email: string,
        password: string
    ): Promise<{ accessToken: string }> {
        const url = `/auth/register`
        return this.post<{ accessToken: string }>(url, { username, email, password })
    }

    async login(username: string, password: string): Promise<{ accessToken: string }> {
        const url = `/auth/login`
        return this.post<{ accessToken: string }>(url, { username, password })
    }

    async logout(): Promise<void> {
        const url = `/auth/logout`
        return this.post<void>(url, {})
    }
}
