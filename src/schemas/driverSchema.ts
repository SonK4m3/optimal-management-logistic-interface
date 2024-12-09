import { z } from 'zod'

export const driverSchema = z.object({
    username: z.string(),
    email: z.string(),
    fullName: z.string(),
    password: z.string(),
    phone: z.string(),
    licenseNumber: z.string(),
    vehicleType: z.string(),
    vehiclePlate: z.string()
})

export type DriverFormData = z.infer<typeof driverSchema>
