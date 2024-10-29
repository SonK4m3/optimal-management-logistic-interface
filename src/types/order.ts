import { ORDER_STATUS } from '@/constant/enum'

type OrderStatus = (typeof ORDER_STATUS)[keyof typeof ORDER_STATUS]

type Order = {
    id: string
    name: string
    status: OrderStatus
}

export type { Order, OrderStatus }
