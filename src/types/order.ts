import {
    ORDER_STATUS,
    DELIVERY_STATUS,
    SERVICE_TYPE,
    CARGO_TYPE,
    PAYER_TYPE,
    PICKUP_TIME_TYPE
} from '@/constant/enum'
import { Driver } from './driver'
import { Customer } from './resource'

type OrderStatus = (typeof ORDER_STATUS)[keyof typeof ORDER_STATUS]
type DeliveryStatus = (typeof DELIVERY_STATUS)[keyof typeof DELIVERY_STATUS]
type ServiceType = (typeof SERVICE_TYPE)[keyof typeof SERVICE_TYPE]
type PayerType = (typeof PAYER_TYPE)[keyof typeof PAYER_TYPE]
type PriorityType = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
type CargoType = (typeof CARGO_TYPE)[keyof typeof CARGO_TYPE]
type PickupTimeType = (typeof PICKUP_TIME_TYPE)[keyof typeof PICKUP_TIME_TYPE]

type Order = {
    orderId: number
    orderCode: string
    status: OrderStatus
    priority: PriorityType
    totalAmount: number
    totalWeight: number
    customer: Customer
    createdAt: string
    lastUpdated: string
}
interface Sender {
    id: number
    username: string
    fullName: string
    email: string
    phone: string
}

interface PickupWarehouse {
    id: number
    code: string
    name: string
    address: string
    phone: string
    email: string
    latitude: number
    longitude: number
    totalCapacity: number
    currentOccupancy: number
    utilizationRate: number
    openingTime: string
    closingTime: string
    type: string
    status: string
    isActive: boolean
    totalProducts: number
    lowStockProducts: number
    createdAt: string
    updatedAt: string
}

interface OrderProduct {
    id: number
    product: unknown
    quantity: number
    unitPrice: number
}

type Delivery = {
    id: number
    order: OrderWithFee
    status: string
    deliveryNote: string
    deliveryLocation: {
        address: string
        latitude: number
        longitude: number
    }
    estimatedDistance: number
    estimatedDeliveryTime: string
    createdAt: string
    updatedAt: string
    warehouseList: number[]
    statusHistory: StatusHistory[]
    driver?: Driver
}

type StatusHistory = {
    status: string
    timestamp: string
    note: string
    location: {
        address: string
        latitude: number
        longitude: number
    }
    updatedBy: string
}

type DeliveryServiceType = 'STANDARD' | 'EXPRESS' | 'SPECIAL'

type DeliveryFee = {
    baseFee: number
    weightFee: number
    surcharge: number
    totalFee: number
    serviceType: DeliveryServiceType
}

type OrderWithFee = Order & {
    deliveryFee: DeliveryFee
    subTotal: number
    delivery: Delivery
}

export type {
    Order,
    OrderStatus,
    Sender,
    PickupWarehouse,
    OrderProduct,
    Delivery,
    DeliveryStatus,
    ServiceType,
    PayerType,
    PriorityType,
    CargoType,
    PickupTimeType,
    DeliveryFee,
    DeliveryServiceType,
    OrderWithFee,
    StatusHistory
}
