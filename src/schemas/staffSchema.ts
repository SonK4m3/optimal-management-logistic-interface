import { z } from 'zod'

export const staffSchema = z.object({
    username: z.string().min(1, { message: 'Username is required' }),
    email: z.string().min(1, { message: 'Email is required' }),
    password: z.string().min(1, { message: 'Password is required' }),
    fullName: z.string().min(1, { message: 'Full name is required' })
})

export type StaffFormValues = z.infer<typeof staffSchema>
