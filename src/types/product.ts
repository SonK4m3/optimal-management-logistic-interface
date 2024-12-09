import { STORAGE_CONDITION } from '@/constant/enum'

export type StorageCondition = (typeof STORAGE_CONDITION)[keyof typeof STORAGE_CONDITION]

export type Product = {
    id: number
    code: string
    name: string
    unit: string
    price: number
    weight: number
    dimensions: string
    minStockLevel: number
    maxStockLevel: number
    reorderPoint: number
    storageCondition: string
    imageUrl: string
    category: Category
    supplier: Supplier
}

export type Category = {
    id: number
    name: string
}

export type Supplier = {
    id: number
    name: string
    status: string
    productCount: number
    createdAt: string
    updatedAt: string
}
