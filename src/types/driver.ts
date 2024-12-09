import { VEHICLE_TYPE, DRIVER_STATUS, DELIVERY_ASSIGNMENT_STATUS } from '@/constant/enum'

export type DriverStatus = (typeof DRIVER_STATUS)[keyof typeof DRIVER_STATUS]
export type DeliveryAssignmentStatus =
    (typeof DELIVERY_ASSIGNMENT_STATUS)[keyof typeof DELIVERY_ASSIGNMENT_STATUS]
export type VehicleType = (typeof VEHICLE_TYPE)[keyof typeof VEHICLE_TYPE]

export type Driver = {
    id: number
    fullName: string
    phone: string
    licenseNumber: string
    vehicleType: VehicleType
    vehiclePlate: string
    status: DriverStatus
    currentLatitude?: number
    currentLongitude?: number
}

export type WarehouseDriver = {
    driver: Driver
    warehouseIds: number[]
}

export type DeliveryAssignment = {
    id: number
    deliveryId: number
    driverId: number
    warehouseIds: number[]
    assignedAt: string
    status: DeliveryAssignmentStatus
    rejectionReason: string
    respondedAt: string
    expiresAt: string
}
