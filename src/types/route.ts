import { Delivery } from '@/types/order'

export type Route = {
    id: number
    routeCode: string
    routeName: string
}

export interface Stop {
    id: number
    route: string
    delivery: Delivery
    sequenceNumber: number
    plannedArrival: string
    status: string
}
