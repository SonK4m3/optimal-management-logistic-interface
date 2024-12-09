import { WAREHOUSE_TYPE, RECEIPT_STATUS } from '@/constant/enum'
import { Staff } from './resource'

export type Warehouse = {
    id: number
    code: string
    name: string
    location: {
        id: number
        address: string
        latitude: number
        longitude: number
    }
    status: string
    type: string
    totalArea: number
    totalCapacity: number
    manager: Staff
    createdAt: string
    updatedAt: string
}

export type WarehouseType = (typeof WAREHOUSE_TYPE)[keyof typeof WAREHOUSE_TYPE]
export type ReceiptStatus = (typeof RECEIPT_STATUS)[keyof typeof RECEIPT_STATUS]
export type ReceiptType = 'INBOUND' | 'OUTBOUND'

export type ReceiptItem = {
    id: number
    productId: number
    productCode: string
    productName: string
    quantity: number
    note: string
}

export type Receipt = {
    id: number
    receiptNumber: string
    createdAt: string
    status: ReceiptStatus
    type: string
    storageLocation: StorageLocation
    items: ReceiptItem[]
    notes: string
    createdBy: string
    confirmedBy?: string
    confirmedAt?: string
}

export type CheckWarehouseSpace = {
    warehouseId: number
    warehouseCode: string
    totalArea: number
    usedArea: number
    availableArea: number
    totalCapacity: number
    usedCapacity: number
    availableCapacity: number
    spaceUtilizationPercentage: number
    capacityUtilizationPercentage: number
}
export type StorageLocationType = 'RACK' | 'SHELF' | 'BIN' | 'FLOOR' | 'COLD_ROOM'

export type StorageLocation = {
    id: number
    code: string
    storageArea: StorageArea
    type: StorageLocationType
    length: number
    width: number
    height: number
    maxWeight: number
    isOccupied: boolean
    level: number
    position: number
}

export type StorageAreaType = 'RECEIVING' | 'SHIPPING' | 'STORAGE'

export type StorageArea = {
    id: number
    name: string
    type: StorageAreaType
    area: number
    currentOccupancy: number
    isActive: boolean
    warehouse: Warehouse
    utilizationRate: number
}
