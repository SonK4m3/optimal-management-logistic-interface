import { Product } from '@/types/product'
import { StorageLocation } from '@/types/warehouse'

export type Inventory = {
    id: number
    storageLocation: StorageLocation
    product: Product
    quantity: number
    minQuantity: number
    maxQuantity: number
    location: string
    status: string
    expiryDate: string
}
