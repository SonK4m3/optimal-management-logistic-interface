import { AppResponse, DocsResponseWithPagination } from '@/types/response'
import BaseRequest from './BaseRequest'
import { Staff, Task, TaskAssignment } from '@/types/resource'
import { TaskRequestPayload } from '@/types/request'

export default class TaskRequest extends BaseRequest {
    async createTask(payload: TaskRequestPayload) {
        return await this.post<AppResponse<Task>>('/task-assignments/tasks', payload)
    }

    async getTasks({ page = 1, size = 10 }: { page?: number; size?: number }) {
        return await this.get<AppResponse<DocsResponseWithPagination<Task>>>(
            `/task-assignments/tasks?page=${page}&size=${size}`
        )
    }

    async getAllTasks() {
        return await this.get<AppResponse<Task[]>>('/task-assignments')
    }

    async assignTask(payload: { taskId: number; staffId: number; note: string }) {
        return await this.post<{
            id: number
            task: Task
            staff: Staff
            status: string
            note: string
            createdAt: string
            updatedAt: string
        }>(`/task-assignments/assignments`, payload)
    }

    async getTasksByStaffId(params: { staffId: number; page?: number; size?: number }) {
        return await this.get<AppResponse<DocsResponseWithPagination<TaskAssignment>>>(
            `/task-assignments?staffId=${params.staffId}&page=${params.page}&size=${params.size}`
        )
    }
}
