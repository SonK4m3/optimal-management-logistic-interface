import BaseRequest from '@/services/BaseRequest.ts'
import { Wallet } from '@/types'
import { WalletRequestBody, WalletRequestParams } from '@/types/request'
import { DocsResponseWithPagination } from '@/types/response'

export default class WalletRequest extends BaseRequest {
    async createWallet(data: WalletRequestBody) {
        const url = `/wallets/user/create`
        return await this.post<Wallet>(url, data)
    }

    async getWallet(params: WalletRequestParams) {
        const url = `/wallets/user`
        return await this.get<DocsResponseWithPagination<Wallet>>(url, params)
    }
}
