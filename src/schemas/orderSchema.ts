import { z } from 'zod'

/**
 * Schema for order item details
 * Validates individual item entries in an order
 */
export const orderItemSchema = z.object({
    productId: z.number().int().positive('Product ID must be a positive integer'),
    quantity: z.number().int().positive('Quantity must be a positive integer'),
    price: z.number().positive('Price must be positive'),
    weight: z.number().positive('Weight must be positive')
})

/**
 * Main order schema for validating order creation requests
 * @input - Order creation payload matching Root interface
 * @output - Validated order data
 */
export const orderSchema = z.object({
    items: z.array(orderItemSchema).min(1, 'At least one item is required'),
    priority: z.string().min(1, 'Priority is required'),
    deliveryNote: z.string().optional(),
    customerLocationId: z.number().int().positive('Invalid pickup location ID'),
    deliveryServiceType: z.enum(['STANDARD', 'EXPRESS', 'SPECIAL'])
})

// Type inference
export type OrderSchemaType = z.infer<typeof orderSchema>
