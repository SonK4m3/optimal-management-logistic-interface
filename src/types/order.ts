import {
    ORDER_STATUS,
    DELIVERY_STATUS,
    SERVICE_TYPE,
    CARGO_TYPE,
    PAYER_TYPE,
    PICKUP_TIME_TYPE
} from '@/constant/enum'
import { Driver } from './driver'

type OrderStatus = (typeof ORDER_STATUS)[keyof typeof ORDER_STATUS]
type DeliveryStatus = (typeof DELIVERY_STATUS)[keyof typeof DELIVERY_STATUS]
type ServiceType = (typeof SERVICE_TYPE)[keyof typeof SERVICE_TYPE]
type PayerType = (typeof PAYER_TYPE)[keyof typeof PAYER_TYPE]
type PriorityType = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
type CargoType = (typeof CARGO_TYPE)[keyof typeof CARGO_TYPE]
type PickupTimeType = (typeof PICKUP_TIME_TYPE)[keyof typeof PICKUP_TIME_TYPE]
type ReceiverLocation = {
    address: string
    latitude: number
    longitude: number
    district: string
    province: string
    ward: string
}
type Order = {
    id: number
    orderCode: string
    orderDate: string
    status: OrderStatus
    priority: PriorityType
    cargoType: CargoType
    payer: PayerType
    serviceType: ServiceType
    sender: Sender
    weight: number
    receiverName: string
    receiverPhone: string
    receiverAddress: string
    receiverLocation: ReceiverLocation
    pickupWarehouse: PickupWarehouse
    pickupTime: string
    orderProducts: OrderProduct[]
    deliveryNote: string
    lastUpdated: string
    lastUpdatedBy: string
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

interface Delivery {
    id: number
    order: Order
    status: DeliveryStatus
    deliveryNotes: string
    driver: Driver
    currentLocation: string
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
    PickupTimeType
}
