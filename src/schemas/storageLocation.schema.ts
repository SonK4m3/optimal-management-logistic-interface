import { z } from 'zod'

export const storageLocationSchema = z.object({
    storageAreaId: z.string(),
    type: z.enum(['RACK', 'SHELF', 'BIN', 'FLOOR', 'COLD_ROOM']),
    length: z.number(),
    width: z.number(),
    height: z.number(),
    maxWeight: z.number(),
    level: z.number(),
    position: z.number()
})

export type StorageLocationFormData = z.infer<typeof storageLocationSchema>
