import { z } from 'zod'

export const shiftSchema = z.object({
    name: z.string(),
    startTime: z.string(),
    endTime: z.string()
})

export type ShiftFormValues = z.infer<typeof shiftSchema>
