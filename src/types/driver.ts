import { VEHICLE_TYPE } from '@/constant/enum'

export type Driver = {
    id: number
    driverCode: string
    fullName: string
    phone: string
    status: string
    vehicleType: string
    vehiclePlateNumber: string
    workStartTime: string
    workEndTime: string
    remainingWorkingMinutes: number
    preferredAreas: string
    completedDeliveries: number
    averageRating: number
    currentLatitude: number | null
    currentLongitude: number | null
    isActive: boolean
}

export type VehicleType = (typeof VEHICLE_TYPE)[keyof typeof VEHICLE_TYPE]
