import { Depot, Customer, Vehicle } from '@/types/vrp'
import { StorageCondition } from './product'
import { PriorityType } from './order'

type PaginationParams = {
    page?: number
    limit?: number
}

type VRPRequestPayload = {
    depots: Depot[]
    customers: Customer[]
    vehicles: Vehicle[]
}

type OrderProduct = {
    productId: number
    quantity: number
}

type OrderRequestPayload = {
    customerId: number
    items: OrderProduct[]
    priority: PriorityType
    deliveryNote?: string
    customerLocationId: number
    deliveryServiceType: 'STANDARD' | 'EXPRESS' | 'SPECIAL'
}

type DriverRequestPayload = {
    userId: number
    phone: string
    licenseNumber: string
    vehicleType: string
    vehiclePlateNumber: string
}

type CreateDriverByManagerRequestPayload = {
    username: string
    email: string
    fullName: string
    password: string
    phone: string
    licenseNumber: string
    vehicleType: string
    vehiclePlateNumber: string
}

type WarehouseRequestPayload = {
    name: string
    address: string
    latitude: number
    longitude: number
    totalCapacity: number
    totalArea: number
    type: string
    managerId: number
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

type ReceiptRequestPayload = {
    items: { productId: number; quantity: number; note: string }[]
    storageLocationId: number
    type: 'INBOUND' | 'OUTBOUND'
    notes: string
}

type CreateProductBodyRequest = {
    name: string
    unit: string
    price: number
    weight: number
    dimensions: string
    minStockLevel: number
    maxStockLevel: number
    reorderPoint: number
    storageCondition: StorageCondition
    imageUrl: string
    categoryId: number
    supplierId: number
}

type StorageLocationRequestPayload = {
    storageAreaId: number
    type: string
    length: number
    width: number
    height: number
    maxWeight: number
    level: number
    position: number
}

type ShipmentRequestPayload = {
    warehouseId: number
    shipmentDate: string
    notes: string
    details: {
        productId: number
        quantity: number
        note: string
    }[]
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
    ShiftRequestPayload,
    ReceiptRequestPayload,
    StorageLocationRequestPayload,
    CreateProductBodyRequest,
    ShipmentRequestPayload,
    CreateDriverByManagerRequestPayload
}
