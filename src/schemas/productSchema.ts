import { z } from 'zod'
import { STORAGE_CONDITION } from '@/constant/enum'

export const productSchema = z.object({
    name: z.string(),
    unit: z.string(),
    price: z.number(),
    weight: z.number(),
    dimensions: z.string(),
    minStockLevel: z.number(),
    maxStockLevel: z.number(),
    reorderPoint: z.number(),
    storageCondition: z.enum(Object.values(STORAGE_CONDITION) as [string, ...string[]]),
    imageUrl: z.string(),
    categoryId: z.number(),
    supplierId: z.number()
})

export type ProductFormValues = z.infer<typeof productSchema>
