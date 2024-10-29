import BaseRequest from '@/services/BaseRequest.ts'
import { Chain } from '@/types'

export default class ExchangeRequest extends BaseRequest {
    async getNetworks() {
        const url = `/exchanges`
        return await this.get<{ networks: Chain[] }>(url)
    }
}
