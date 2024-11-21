import { z } from 'zod'

export const taskSchema = z.object({
    title: z.string(),
    description: z.string(),
    startTime: z.string(),
    endTime: z.string(),
    priority: z.string()
})

export type TaskFormValues = z.infer<typeof taskSchema>
