import { z } from 'zod'

export const driverSchema = z.object({
    fullName: z.string().min(2, 'Full name must be at least 2 characters'),
    phone: z.string().regex(/^[0-9]{10}$/, 'Phone number must be 10 digits'),
    email: z.string().email('Invalid email address'),
    licenseNumber: z.string().min(5, 'License number is required'),
    vehicleType: z.enum(['MOTORCYCLE', 'CAR', 'VAN', 'TRUCK']),
    vehiclePlateNumber: z.string().min(5, 'Valid vehicle plate number is required'),
    vehicleCapacity: z.number().min(1, 'Capacity must be greater than 0'),
    workStartTime: z.string(),
    workEndTime: z.string(),
    preferredAreas: z.string().min(1, 'Preferred areas are required'),
    maxDeliveryRadius: z.number().min(1, 'Maximum delivery radius must be greater than 0'),
    baseRate: z.number().min(0, 'Base rate must be non-negative'),
    ratePerKm: z.number().min(0, 'Rate per km must be non-negative')
})

export type DriverFormData = z.infer<typeof driverSchema>
