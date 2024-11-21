import { z } from 'zod'
import { SERVICE_TYPE, CARGO_TYPE, PAYER_TYPE, PICKUP_TIME_TYPE } from '@/constant/enum'

/**
 * Schema for order product details
 * Validates individual product entries in an order
 */
export const orderProductSchema = z.object({
    name: z.string().min(1, 'Product name is required'),
    price: z.number().positive('Price must be positive'),
    quantity: z.number().int().positive('Quantity must be a positive integer'),
    weight: z.number().positive('Weight must be positive')
})

/**
 * Main order schema for validating order creation requests
 * @input - Order creation payload
 * @output - Validated order data matching OrderRequestPayload type
 */
export const orderSchema = z.object({
    receiverName: z.string().min(2, 'Receiver name must be at least 2 characters'),
    receiverPhone: z.string().min(10, 'Please enter a valid phone number'),
    receiverAddress: z.string().min(5, 'Please enter a valid address'),
    receiverLatitude: z.number({
        required_error: 'Receiver latitude is required'
    }),
    receiverLongitude: z.number({
        required_error: 'Receiver longitude is required'
    }),
    orderProducts: z.array(orderProductSchema).min(1, 'At least one product is required'),
    pickupTime: z.enum(Object.values(PICKUP_TIME_TYPE) as [string, ...string[]], {
        required_error: 'Please select a valid pickup time'
    }),
    serviceType: z.enum(Object.values(SERVICE_TYPE) as [string, ...string[]], {
        required_error: 'Please select a valid service type'
    }),
    cargoType: z.enum(Object.values(CARGO_TYPE) as [string, ...string[]], {
        required_error: 'Please select a valid cargo type'
    }),
    payer: z.enum(Object.values(PAYER_TYPE) as [string, ...string[]], {
        required_error: 'Please specify who will pay'
    }),
    pickupWarehouseId: z.number().int().positive('Invalid warehouse ID'),
    deliveryNote: z.string().optional()
})

// Type inference
export type OrderSchemaType = z.infer<typeof orderSchema>
