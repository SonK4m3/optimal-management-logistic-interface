import { z } from 'zod'
import { WAREHOUSE_TYPE } from '@/constant/enum'

// Time format validation regex (HH:mm:ss)
const timeFormatRegex = /^([0-1][0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/

export const warehouseSchema = z.object({
    code: z
        .string()
        .min(3, 'Code must be at least 3 characters')
        .regex(/^WH-\d{3}$/, 'Code must follow format WH-XXX where X is a number'),
    name: z.string().min(3, 'Name must be at least 3 characters'),
    address: z.string().min(5, 'Please enter a valid address'),
    latitude: z
        .number()
        .min(-90, 'Latitude must be between -90 and 90')
        .max(90, 'Latitude must be between -90 and 90'),
    longitude: z
        .number()
        .min(-180, 'Longitude must be between -180 and 180')
        .max(180, 'Longitude must be between -180 and 180'),
    totalCapacity: z.number().positive('Capacity must be positive'),
    type: z.nativeEnum(WAREHOUSE_TYPE),
    city: z.string().min(2, 'City name is required'),
    state: z.string().min(2, 'State is required'),
    country: z.string().min(2, 'Country is required'),
    postalCode: z.string().min(5, 'Please enter a valid postal code'),
    phone: z.string().regex(/^\+?[\d\s-]{10,}$/, 'Please enter a valid phone number'),
    email: z.string().email('Please enter a valid email'),
    contactPerson: z.string().min(3, 'Contact person name is required'),
    openingTime: z
        .string()
        .regex(timeFormatRegex, 'Invalid time format. Use HH:mm:ss')
        .refine(time => {
            const [hours] = time.split(':').map(Number)
            return hours >= 0 && hours <= 23
        }, 'Hours must be between 00 and 23'),
    closingTime: z
        .string()
        .regex(timeFormatRegex, 'Invalid time format. Use HH:mm:ss')
        .refine(time => {
            const [hours] = time.split(':').map(Number)
            return hours >= 0 && hours <= 23
        }, 'Hours must be between 00 and 23'),
    isOpen24Hours: z.boolean(),
    workingDays: z.string().min(1, 'Working days are required'),
    hasLoadingDock: z.boolean(),
    hasRefrigeration: z.boolean(),
    hasSecuritySystem: z.boolean(),
    temperatureMin: z.number(),
    temperatureMax: z
        .number()
        .refine(val => val > -273.15, 'Temperature cannot be below absolute zero'),
    area: z.number().min(1, 'Area is required')
})

export type WarehouseFormData = z.infer<typeof warehouseSchema>
