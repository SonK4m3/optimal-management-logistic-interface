import axios, { AxiosRequestConfig, AxiosResponse } from 'axios'
import { setAuthorizationToRequest, setDefaultAuthorizationToRequest } from '@/lib/authenticate'
import { store } from '@/store'
import config from '@/configs'

type RequestParams = Record<string, number | string | (string | number)[]>
type RequestData = Record<string, unknown>

interface ErrorResponse {
    response?: {
        status?: number
        data?: {
            message?: string | object
            data?: {
                message?: string
            }
        }
    }
}

export default class BaseRequest {
    private readonly baseURL: string

    constructor(baseUrl?: string) {
        this.baseURL = baseUrl || config.app.apiUrl
        const accessToken = store.getState().user.accessToken
        accessToken ? setAuthorizationToRequest(accessToken) : setDefaultAuthorizationToRequest()
    }

    private async request<T>(
        method: string,
        url: string,
        config: AxiosRequestConfig = {}
    ): Promise<T> {
        try {
            const response: AxiosResponse<T> = await axios({
                method,
                url: this.baseURL + url,
                ...config
            })
            return response.data
        } catch (error) {
            throw await this.errorHandler(error as ErrorResponse)
        }
    }

    async get<T>(url: string, params?: RequestParams): Promise<T> {
        return this.request<T>('get', url, { params })
    }

    async post<T>(url: string, data: RequestData): Promise<T> {
        return this.request<T>('post', url, { data })
    }

    async put<T>(url: string, data: RequestData): Promise<T> {
        return this.request<T>('put', url, { data })
    }

    async patch<T>(url: string, data: RequestData): Promise<T> {
        return this.request<T>('patch', url, { data })
    }

    async delete<T>(url: string, data?: RequestData): Promise<T> {
        return this.request<T>('delete', url, { data })
    }

    async download(url: string, params?: RequestParams): Promise<Blob> {
        return this.request<Blob>('get', url, { params, responseType: 'blob' })
    }

    private async errorHandler(err: ErrorResponse): Promise<never> {
        if (
            err.response?.status === 401 &&
            err.response.data?.message !== 'Credential is not correct'
        ) {
            // TODO: handle 401 error (e.g., logout user, refresh token)
            throw new Error('Unauthorized')
        }

        if (err.response?.status === 403) {
            // TODO: handle 403 error (e.g., show permission denied message)
            throw new Error('Forbidden')
        }

        const errorMessage =
            err.response?.data?.data?.message ||
            (typeof err.response?.data?.message === 'object'
                ? JSON.stringify(err.response.data.message)
                : err.response?.data?.message) ||
            'An error occurred'

        throw new Error(errorMessage)
    }
}
