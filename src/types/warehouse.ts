import { WAREHOUSE_TYPE } from '@/constant/enum'

export type Warehouse = {
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
    utilizationRate: number | null
    openingTime: string | null
    closingTime: string | null
    type: WarehouseType | null
    status: string | null
    isActive: boolean
    totalProducts: number | null
    lowStockProducts: number | null
    createdAt: string
    updatedAt: string
}

export type WarehouseType = (typeof WAREHOUSE_TYPE)[keyof typeof WAREHOUSE_TYPE]

export interface WarehouseFormValues {
    code: string
    name: string
    address: string
    latitude: number
    longitude: number
    totalCapacity: number
    type: WarehouseType
    city: string
    state: string
    country: string
    postalCode: string
    phone: string
    email: string
    contactPerson: string
    openingTime: string
    closingTime: string
    isOpen24Hours: boolean
    workingDays: string
    hasLoadingDock: boolean
    hasRefrigeration: boolean
    hasSecuritySystem: boolean
    temperatureMin: number
    temperatureMax: number
    area: number
}
