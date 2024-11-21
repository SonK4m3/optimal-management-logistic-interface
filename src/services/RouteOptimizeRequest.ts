import BaseRequest from '@/services/BaseRequest'
import { RouteOptimizeResponse } from '@/types/response'

export default class RouteOptimizeRequest extends BaseRequest {
    async getOptimizeRoutes() {
        return await this.post<RouteOptimizeResponse>('/routes/optimize')
    }

    async getReoptimizeRoutes() {
        return await this.post<RouteOptimizeResponse>('/routes/reoptimize')
    }
}
