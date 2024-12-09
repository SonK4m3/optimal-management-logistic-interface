import { z } from 'zod'
import { WAREHOUSE_TYPE } from '@/constant/enum'

export const warehouseSchema = z.object({
    name: z.string(),
    address: z.string(),
    latitude: z.number(),
    longitude: z.number(),
    totalCapacity: z.number(),
    totalArea: z.number(),
    type: z.enum(Object.values(WAREHOUSE_TYPE) as [string, ...string[]]),
    managerId: z.number()
})

export type WarehouseFormData = z.infer<typeof warehouseSchema>
