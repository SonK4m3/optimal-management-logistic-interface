import BaseRequest from '@/services/BaseRequest.ts'
import { TA } from '@/types'
import config from '@/configs'

export default class TARequest extends BaseRequest {
    constructor() {
        super(config.app.taApiUrl)
    }

    async getTA(query: string): Promise<TA[]> {
        const url = `/ta?key=${query}`
        return await this.get<TA[]>(url)
    }
}
