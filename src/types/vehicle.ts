export type VehicleStatus = 'AVAILABLE' | 'UNAVAILABLE'

export type VehicleType = 'CAR' | 'MOTORCYCLE'

export type Vehicle = {
    id: number
    vehicleCode: string
    capacity: number
    costPerKm: number
    status: VehicleStatus
    currentLat: number
    currentLng: number
    currentUtilization: number
    activeDeliveries: number
}
