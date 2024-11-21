import FormSelect from '@/components/FormSelect'
import BaseLayout from '@/components/layout/BaseLayout'
import RequestFactory from '@/services/RequestFactory'
import { Driver } from '@/types/driver'
import { useEffect, useState } from 'react'
import DriverCard from './DriverCard'
import DeliveryCard from './DeliveryCard'
import DriverMap from './DriverMap'
import { Warehouse } from '@/types/warehouse'
import { Order } from '@/types/order'
const DriverPage = () => {
    const request = RequestFactory.getRequest('DriverRequest')
    const requestOrder = RequestFactory.getRequest('OrderRequest')
    const requestWarehouse = RequestFactory.getRequest('WarehouseRequest')

    const [currentMarker, setCurrentMarker] = useState<{ lat: number; lng: number } | null>(null)

    const [orders, setOrders] = useState<Order[]>([])
    const [warehouses, setWarehouses] = useState<Warehouse[]>([])
    const [drivers, setDriver] = useState<Driver[]>([])
    const [currentDriver, setCurrentDriver] = useState<Driver | null>(null)

    const fetchDriver = async () => {
        const response = await request.getDrivers()
        setDriver(response.data)
    }

    const fetchOrders = async () => {
        const response = await requestOrder.getOdersByUser({ page: 1, limit: 10 })
        setOrders(response.data.docs)
    }

    const fetchWarehouses = async () => {
        const response = await requestWarehouse.getWarehouses()
        setWarehouses(response.data)
    }

    const handleSelectDriver = (fullName: string) => {
        const selectedDriver = drivers.find(driver => driver.fullName === fullName)
        setCurrentDriver(selectedDriver || null)
    }

    const handleUpdateDriver = (driver: Driver) => {
        const newDrivers = drivers.map(d => (d.id === driver.id ? driver : d))
        setDriver(newDrivers)
        setCurrentDriver(driver)
    }

    const handleClickToMap = (marker: { lat: number; lng: number }) => {
        setCurrentMarker(marker)
    }

    useEffect(() => {
        fetchDriver()
        fetchOrders()
        fetchWarehouses()
    }, [])

    return (
        <BaseLayout title='Driver'>
            <div className='flex flex-col gap-4'>
                <div>
                    <FormSelect
                        options={drivers.map(driver => driver.fullName)}
                        selected={currentDriver?.fullName || 'Select Driver'}
                        onSelect={handleSelectDriver}
                    />
                </div>
                <DriverCard driver={currentDriver} />
                <DeliveryCard
                    driver={currentDriver}
                    onUpdate={handleUpdateDriver}
                    currentMarker={currentMarker}
                />
                <DriverMap
                    driver={currentDriver}
                    orders={orders}
                    warehouses={warehouses}
                    currentMarker={currentMarker}
                    onClickToMap={handleClickToMap}
                />
            </div>
        </BaseLayout>
    )
}

export default DriverPage
