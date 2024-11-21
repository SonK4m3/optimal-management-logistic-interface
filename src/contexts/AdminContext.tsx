import RequestFactory from '@/services/RequestFactory'
import { RootState } from '@/store'
import { Driver } from '@/types/driver'
import { Delivery, Order } from '@/types/order'
import { Warehouse } from '@/types/warehouse'
import { Vehicle } from '@/types/vehicle'
import { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { useSelector } from 'react-redux'

interface AdminContextType {
    drivers: Driver[]
    orders: Order[]
    warehouses: Warehouse[]
    inTransit: Delivery[]
    fetchDrivers: () => Promise<void>
    fetchOrders: () => Promise<void>
    fetchWarehouses: () => Promise<void>
    fetchInTransit: (driverId: number) => Promise<void>
    selectedDriver: Driver | null
    setSelectedDriver: (driver: Driver | null) => void
    vehicles: Vehicle[]
    fetchVehicles: () => Promise<void>
}

const AdminContext = createContext<AdminContextType | undefined>(undefined)

const AdminProvider = ({ children }: { children: React.ReactNode }) => {
    const requestDriver = RequestFactory.getRequest('DriverRequest')
    const requestOrder = RequestFactory.getRequest('OrderRequest')
    const requestWarehouse = RequestFactory.getRequest('WarehouseRequest')
    const requestVehicle = RequestFactory.getRequest('VehicleRequest')
    const accessToken = useSelector((state: RootState) => state.user.accessToken)

    const [drivers, setDrivers] = useState<Driver[]>([])
    const [orders, setOrders] = useState<Order[]>([])
    const [warehouses, setWarehouses] = useState<Warehouse[]>([])
    const [inTransit, setInTransit] = useState<Delivery[]>([])
    const [vehicles, setVehicles] = useState<Vehicle[]>([])
    const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null)

    const fetchInTransit = useCallback(
        async (driverId: number) => {
            if (!accessToken) return

            setInTransit([])

            try {
                const response = await requestOrder.inTransit(driverId)
                if (response.success) {
                    setInTransit(response.data)
                }
            } catch (error) {
                console.error(error)
                setInTransit([])
            }
        },
        [accessToken, requestOrder]
    )

    const fetchDrivers = useCallback(async () => {
        if (!accessToken) return

        try {
            const response = await requestDriver.getDrivers()
            if (response.success) {
                setDrivers(response.data)
            }
        } catch (error) {
            console.error(error)
        }
    }, [accessToken, requestDriver])

    const fetchOrders = useCallback(async () => {
        if (!accessToken) return

        setOrders([])

        try {
            const response = await requestOrder.getOdersByUser({ page: 1, limit: 100 })
            if (response.success) {
                setOrders(response.data.docs)
            }
        } catch (error) {
            setOrders([])
            console.error(error)
        }
    }, [accessToken, requestOrder])

    const fetchWarehouses = useCallback(async () => {
        if (!accessToken) return

        try {
            const response = await requestWarehouse.getWarehouses()
            if (response.success) {
                setWarehouses(response.data)
            }
        } catch (error) {
            console.error(error)
        }
    }, [accessToken, requestWarehouse])

    const fetchVehicles = useCallback(async () => {
        if (!accessToken) return

        try {
            const response = await requestVehicle.getVehicles()
            if (response.success) {
                setVehicles(response.data)
            }
        } catch (error) {
            console.error(error)
        }
    }, [accessToken, requestVehicle])

    useEffect(() => {
        fetchDrivers()
        fetchOrders()
        fetchWarehouses()
        fetchVehicles()
    }, [fetchDrivers, fetchOrders, fetchWarehouses, fetchVehicles])

    return (
        <AdminContext.Provider
            value={{
                drivers,
                orders,
                warehouses,
                inTransit,
                fetchDrivers,
                fetchOrders,
                fetchWarehouses,
                fetchInTransit,
                selectedDriver,
                setSelectedDriver,
                vehicles,
                fetchVehicles
            }}
        >
            {children}
        </AdminContext.Provider>
    )
}

export const useAdminContext = () => {
    const context = useContext(AdminContext)
    if (context === undefined) {
        throw new Error('useAdminContext must be used within an AdminProvider')
    }
    return context
}

export default AdminProvider
