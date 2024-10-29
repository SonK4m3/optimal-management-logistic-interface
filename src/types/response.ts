type DocsResponse<T> = {
    totalDocs: number
    totalPages: number
    limit: number
    page: number
    docs: T[]
}

type DocsResponseWithPagination<T> = DocsResponse<T> & {
    pagingCounter: number
    offset: number
    hasNextPage: boolean
    hasPrevPage: boolean
}

type OAuthResponse = {
    access_token: string
}

type AppResponse<T> = {
    success: boolean
    message: string
    data: T
}

type VRPResponse = {
    vrp: string
}

export type { DocsResponse, DocsResponseWithPagination, OAuthResponse, VRPResponse, AppResponse }
