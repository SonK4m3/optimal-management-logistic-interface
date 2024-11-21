import { Vehicle, Customer, Depot, Location } from '@/types/vrp'
import { Vehicle as AppVehicle } from '@/types/vehicle'
import { Stop } from '@/types/route'

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

type VRPResultResponse = {
    depotList: Depot[]
    customerList: Customer[]
    vehicleList: Vehicle[]
    capacity: number
    valueRange: {
        id: number
        location: Location
        demand: number
    }[]
}

type LoginResponse = {
    token: string
    id: number
    username: string
    email: string
    role: string
    expiresIn: number
    issuedAt: string
    expirationTime: string
    lastLoginTime: string
}

type RouteOptimizeResponse = {
    id: number
    vehicle: AppVehicle
    stops: Stop[]
    totalDistance: number
    totalCost: number
    status: string
}

export type {
    DocsResponse,
    DocsResponseWithPagination,
    OAuthResponse,
    VRPResponse,
    VRPResultResponse,
    AppResponse,
    LoginResponse,
    RouteOptimizeResponse
}
