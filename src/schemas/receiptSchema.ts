import { z } from 'zod'

export const createReceiptSchema = z.object({
    items: z.array(
        z.object({
            productId: z.number(),
            quantity: z.number(),
            note: z.string()
        })
    ),
    storageLocationId: z.number(),
    notes: z.string()
})

export type CreateReceiptSchema = z.infer<typeof createReceiptSchema>
