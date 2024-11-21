import { z } from 'zod'

export const vehicleSchema = z.object({
    vehicleCode: z.string().min(9).max(9),
    capacity: z.number().min(0),
    costPerKm: z.number().min(0),
    initialLat: z.number().min(-90).max(90),
    initialLng: z.number().min(-180).max(180)
})

export type VehicleFormValues = z.infer<typeof vehicleSchema>
