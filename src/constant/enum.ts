const ORDER_STATUS = {
    PENDING: 'PENDING',
    PROCESSING: 'PROCESSING',
    SHIPPED: 'SHIPPED',
    DELIVERED: 'DELIVERED',
    CANCELLED: 'CANCELLED'
} as const

const WAREHOUSE_TYPE = {
    NORMAL: 'NORMAL',
    COLD: 'COLD',
    DANGEROUS: 'DANGEROUS'
} as const

const VEHICLE_TYPE = {
    MOTORCYCLE: 'MOTORCYCLE',
    CAR: 'CAR',
    VAN: 'VAN',
    TRUCK: 'TRUCK'
} as const

const DELIVERY_STATUS = {
    PENDING: 'PENDING', // Initial state
    WAITING_FOR_DRIVER_ACCEPTANCE: 'WAITING_FOR_DRIVER_ACCEPTANCE', // Waiting for driver to accept the delivery
    DRIVER_ACCEPTED: 'DRIVER_ACCEPTED', // Driver has accepted the delivery
    IN_TRANSIT: 'IN_TRANSIT', // On the way to customer
    DELIVERED: 'DELIVERED', // Successfully delivered
    CANCELLED: 'CANCELLED' // Delivery cancelled
} as const

const SERVICE_TYPE = {
    STANDARD: 'STANDARD',
    EXPRESS: 'EXPRESS',
    SAME_DAY: 'SAME_DAY',
    NEXT_DAY: 'NEXT_DAY',
    INTERNATIONAL: 'INTERNATIONAL',
    ECONOMY: 'ECONOMY'
} as const

const CARGO_TYPE = {
    GENERAL: 'GENERAL',
    FRAGILE: 'FRAGILE',
    PERISHABLE: 'PERISHABLE',
    DANGEROUS: 'DANGEROUS',
    VALUABLE: 'VALUABLE',
    TEMPERATURE_CONTROLLED: 'TEMPERATURE_CONTROLLED',
    OVERSIZED: 'OVERSIZED',
    DOCUMENT: 'DOCUMENT'
} as const

const PAYER_TYPE = {
    SENDER: 'SENDER',
    RECEIVER: 'RECEIVER'
} as const

const PICKUP_TIME_TYPE = {
    EARLY_MORNING: 'EARLY_MORNING',
    MORNING: 'MORNING',
    AFTERNOON: 'AFTERNOON',
    EVENING: 'EVENING'
} as const

const RECEIPT_STATUS = {
    DRAFT: 'DRAFT',
    PENDING: 'PENDING',
    APPROVED: 'APPROVED',
    COMPLETED: 'COMPLETED',
    CANCELLED: 'CANCELLED'
} as const

const STORAGE_CONDITION = {
    NORMAL: 'NORMAL',
    COLD: 'COLD',
    FROZEN: 'FROZEN',
    DANGEROUS: 'DANGEROUS'
} as const

const SHIFT_STATUS = {
    SCHEDULED: 'SCHEDULED',
    COMPLETED: 'COMPLETED',
    ABSENT: 'ABSENT'
} as const

const DRIVER_STATUS = {
    NOT_ACCEPTING_ORDERS: 'NOT_ACCEPTING_ORDERS',
    DELIVERING: 'DELIVERING',
    READY_TO_ACCEPT_ORDERS: 'READY_TO_ACCEPT_ORDERS'
} as const

const DELIVERY_ASSIGNMENT_STATUS = {
    WAITING_FOR_DRIVER_ACCEPTANCE: 'WAITING_FOR_DRIVER_ACCEPTANCE',
    DRIVER_ACCEPTED: 'DRIVER_ACCEPTED',
    DRIVER_REJECTED: 'DRIVER_REJECTED',
    IN_PROGRESS: 'IN_PROGRESS',
    DELIVERED: 'DELIVERED'
} as const

const HANOI_LOCATION = {
    LAT: 21.0245,
    LNG: 105.8412
}

const HO_CHI_MINH_LOCATION = {
    LAT: 10.8231,
    LNG: 106.6295
}

const DA_NANG_LOCATION = {
    LAT: 16.0674,
    LNG: 108.2211
}

export {
    ORDER_STATUS,
    WAREHOUSE_TYPE,
    VEHICLE_TYPE,
    DELIVERY_STATUS,
    SERVICE_TYPE,
    CARGO_TYPE,
    PAYER_TYPE,
    PICKUP_TIME_TYPE,
    RECEIPT_STATUS,
    STORAGE_CONDITION,
    SHIFT_STATUS,
    DRIVER_STATUS,
    DELIVERY_ASSIGNMENT_STATUS,
    HANOI_LOCATION,
    HO_CHI_MINH_LOCATION,
    DA_NANG_LOCATION
}
