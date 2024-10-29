import BaseRequest from '@/services/BaseRequest.ts'
import { Chain } from '@/types'

export default class ChainRequest extends BaseRequest {
    async getChains() {
        const url = `/chains`
        return await this.get<{ chains: Chain[] }>(url)
    }
}
