const ADMIN_PATH = '/admin'
const DRIVER_PATH = '/driver'
const CUSTOMER_PATH = ''

const CUSTOMER_ROUTES = {
    HOME: CUSTOMER_PATH,
    ORDERS: `${CUSTOMER_PATH}/orders`,
    CREATE_ORDER: `${CUSTOMER_PATH}/orders/create`,
    VRP: `${CUSTOMER_PATH}/vrp`,
    REGISTER_DRIVER: `${CUSTOMER_PATH}/register-driver`
}

const ADMIN_ROUTES = {
    DASHBOARD: `${ADMIN_PATH}`,
    STAFF: `${ADMIN_PATH}/staffs`,
    CUSTOMER: `${ADMIN_PATH}/customers`,
    DRIVER: `${ADMIN_PATH}/drivers`,
    TASK: `${ADMIN_PATH}/tasks`,
    SHIFT: `${ADMIN_PATH}/shifts`,
    WAREHOUSE: `${ADMIN_PATH}/warehouse`,
    PRODUCT: `${ADMIN_PATH}/products`,
    INVENTORY: `${ADMIN_PATH}/inventory`,
    STORAGE_LOCATION: `${ADMIN_PATH}/warehouse/storage-location/:warehouseId`,
    DELIVERY: `${ADMIN_PATH}/delivery`,
    DELIVERY_ORDER: `${ADMIN_PATH}/delivery/order/:orderId`
}

const DRIVER_ROUTES = {
    DRIVER: DRIVER_PATH
}

export const ROUTES = {
    LOGIN: '/login',
    ADMIN: { ...ADMIN_ROUTES },
    DRIVER: { ...DRIVER_ROUTES },
    CUSTOMER: { ...CUSTOMER_ROUTES }
} as const
