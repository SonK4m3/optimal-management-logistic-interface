import BaseRequest from '@/services/BaseRequest.ts'
import { VRPResponse } from '@/types/response'

export default class VRPRequest extends BaseRequest {
    async getVRP() {
        return await this.get<VRPResponse>('/vrp/solve-and-display')
    }
}
