import { Shift, ShiftAssignment } from '@/types/resource'
import { AppResponse, DocsResponseWithPagination } from '@/types/response'
import BaseRequest from './BaseRequest'
import { ShiftRequestPayload } from '@/types/request'

export default class ShiftRequest extends BaseRequest {
    async createShift(payload: ShiftRequestPayload) {
        return await this.post<AppResponse<Shift>>('/shift-assignments/shifts', payload)
    }

    async getAllShifts(params: { page: number; size: number }) {
        return await this.get<AppResponse<DocsResponseWithPagination<Shift>>>(
            `/shift-assignments/shifts?page=${params.page}&size=${params.size}`
        )
    }

    async batchCreateShift(payload: {
        shiftId: number
        staffIds: number[]
        workDate: string
        note: string
    }) {
        return await this.post<AppResponse<Shift[]>>('/shift-assignments/batch', payload)
    }

    async getShiftById(params: { staffId: string; page: number; size: number }) {
        return await this.get<AppResponse<DocsResponseWithPagination<ShiftAssignment>>>(
            `/shift-assignments?staffId=${params.staffId}&page=${params.page}&size=${params.size}`
        )
    }
}
