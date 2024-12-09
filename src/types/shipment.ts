import { Warehouse } from './warehouse'
import { User } from './user'
import { Product } from './product'

export type ShipmentStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED'

export type Shipment = {
    id: number
    code: string
    status: ShipmentStatus
    shipmentDate: string
    warehouse: Warehouse
    createdBy: User
    confirmedBy: User
    confirmedAt: string
    notes: string
    details: ShipmentDetail[]
    createdAt: string
    updatedAt: string
}

export type ShipmentDetail = {
    id: number
    product: Product
    quantity: number
    note: string
}
