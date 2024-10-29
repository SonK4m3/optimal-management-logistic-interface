import BaseRequest from '@/services/BaseRequest.ts'
import { BotActionsQueryParams, BotRequestBody } from '@/types/request'
import { Bot, BotAction } from '@/types'
import { DocsResponse, DocsResponseWithPagination } from '@/types/response'

export default class BotRequest extends BaseRequest {
    async getBotById(botId: number) {
        const url = `/bots/${botId}`
        return await this.get<Bot>(url)
    }

    async updateBot(botId: number, data: BotRequestBody) {
        const url = `/bots/${botId}`
        return await this.put(url, data)
    }

    async getBots() {
        const url = `/bots`
        return await this.get<DocsResponse<Bot>>(url)
    }

    async createBot(data: BotRequestBody) {
        const url = `/bots`
        return await this.post<Bot>(url, data)
    }

    async deleteBot(botId: number) {
        const url = `/bots/${botId}`
        return await this.delete(url)
    }

    async getBotActions(botId: number, params: BotActionsQueryParams) {
        const url = `/bots/${botId}/actions`
        return await this.get<DocsResponseWithPagination<BotAction>>(url, params)
    }
}
