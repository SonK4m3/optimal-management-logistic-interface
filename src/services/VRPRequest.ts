import BaseRequest from '@/services/BaseRequest.ts'
import { VRPRequestPayload } from '@/types/request'
import { AppResponse, VRPResponse, VRPResultResponse } from '@/types/response'

export default class VRPRequest extends BaseRequest {
    async createTask(payload: VRPRequestPayload) {
        return await this.post<VRPResponse>('/vrp/tasks', payload)
    }

    async getTaskStatus(taskId: string) {
        return await this.get<VRPResponse>(`/vrp/tasks/${taskId}/status`)
    }

    async getTaskResult(taskId: string) {
        return await this.get<VRPResponse>(`/vrp/tasks/${taskId}/result`)
    }

    async deleteTask(taskId: string) {
        return await this.delete<VRPResponse>(`/vrp/tasks/${taskId}`)
    }

    async solve(payload: VRPRequestPayload) {
        return await this.post<AppResponse<VRPResultResponse>>('/vrp/solve', payload)
    }
}
