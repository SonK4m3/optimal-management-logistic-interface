import BaseRequest from '@/services/BaseRequest.ts'

export default class AuthRequest extends BaseRequest {
    async googleOauth(googleAccessToken: string) {
        const url = `/auth/login/google`
        return this.post<{ accessToken: string }>(url, { googleAccessToken })
    }
}
