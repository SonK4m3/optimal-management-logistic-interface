import { Depot, Customer, Vehicle } from '@/types/vrp'
import { ServiceType, PayerType, PriorityType, CargoType } from '@/types/order'

type PaginationParams = {
    page?: number
    limit?: number
}

type VRPRequestPayload = {
    depots: Depot[]
    customers: Customer[]
    vehicles: Vehicle[]
}

type OrderRequestPayload = {
    senderId: number
    receiverName: string
    receiverPhone: string
    receiverAddress: string
    receiverLatitude: number
    receiverLongitude: number
    orderProducts: {
        name: string
        price: number
        quantity: number
        weight: number
    }[]
    pickupTime: string
    serviceType: ServiceType
    cargoType: CargoType
    payer: PayerType
    pickupWarehouseId: number
    deliveryNote?: string
    priority?: PriorityType
    notes?: string
    isHighValue?: boolean
    isBreakable?: boolean
    requiresCooling?: boolean
    insuranceRequired?: boolean
    inspectionRequired?: boolean
    termsAccepted?: boolean
    pickupNote?: string
}

type DriverRequestPayload = {
    fullName: string
    phone: string
    email: string
    licenseNumber: string
    vehicleType: string
    vehiclePlateNumber: string
    vehicleCapacity: number
    workStartTime: string
    workEndTime: string
    preferredAreas: string
    maxDeliveryRadius: number
    baseRate: number
    ratePerKm: number
}

type WarehouseRequestPayload = {
    name: string
    phone: string
    address: string
}

type VehicleRequestPayload = {
    vehicleCode: string
    capacity: number
    costPerKm: number
    initialLat: number
    initialLng: number
}

type TaskAssignmentRequestPayload = {
    taskId: string
    shiftId: string
}

type TaskRequestPayload = {
    title: string
    description: string
    startTime: string
    endTime: string
    priority: string
}

type ShiftRequestPayload = {
    name: string
    startTime: string
    endTime: string
}

export type {
    VRPRequestPayload,
    OrderRequestPayload,
    DriverRequestPayload,
    WarehouseRequestPayload,
    PaginationParams,
    VehicleRequestPayload,
    TaskAssignmentRequestPayload,
    TaskRequestPayload,
    ShiftRequestPayload
}
