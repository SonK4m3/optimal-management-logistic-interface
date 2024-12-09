import FormSelect from '@/components/FormSelect'
import BaseLayout from '@/components/layout/BaseLayout'
import RequestFactory from '@/services/RequestFactory'
import { DeliveryAssignment, Driver } from '@/types/driver'
import { useEffect, useState } from 'react'
import DriverCard from './DriverCard'
import DeliveryCard from './DeliveryCard'
import DriverMap from './DriverMap'
import { Warehouse } from '@/types/warehouse'
import { Delivery } from '@/types/order'
import DriverDeliveryAssignment from './DriverDeliveryAssignment'
import FlexLabelValue from '@/components/FlexLabelValue'
import { Button } from '@/components/ui/button'

import { HANOI_LOCATION } from '@/constant/enum'

const DriverPage = () => {
    const request = RequestFactory.getRequest('DriverRequest')
    const requestWarehouse = RequestFactory.getRequest('WarehouseRequest')
    const requestDelivery = RequestFactory.getRequest('DeliveryRequest')
    const [currentMarker, setCurrentMarker] = useState<{ lat: number; lng: number } | null>(null)

    const [warehouses, setWarehouses] = useState<Warehouse[]>([])
    const [drivers, setDriver] = useState<Driver[]>([])
    const [currentDriver, setCurrentDriver] = useState<Driver | null>(null)
    const [delivery, setDelivery] = useState<Delivery | null>(null)
    const [selectedDeliveryAssignment, setSelectedDeliveryAssignment] =
        useState<DeliveryAssignment | null>(null)
    const [center, setCenter] = useState<{ lat: number; lng: number }>({
        lat: HANOI_LOCATION.LAT,
        lng: HANOI_LOCATION.LNG
    })

    const fetchDriver = async () => {
        const response = await request.getDrivers()
        setDriver(response.data.docs)
    }

    const fetchWarehouses = async () => {
        const response = await requestWarehouse.getWarehouses()
        setWarehouses(response.data.docs)
    }

    const handleSelectDriver = (fullName: string) => {
        const selectedDriver = drivers.find(driver => driver.fullName === fullName)
        setCurrentDriver(selectedDriver || null)
        setSelectedDeliveryAssignment(null)
        setDelivery(null)
        setCurrentMarker(null)
    }

    const handleUpdateDriver = (driver: Driver) => {
        const newDrivers = drivers.map(d => (d.id === driver.id ? driver : d))
        setDriver(newDrivers)
    }

    const handleClickToMap = (marker: { lat: number; lng: number }) => {
        setCurrentMarker(marker)
    }

    const fetchDelivery = async () => {
        const response = await requestDelivery.getDeliveryById(
            selectedDeliveryAssignment?.deliveryId.toString() || ''
        )
        setDelivery(response.data)
    }

    useEffect(() => {
        fetchDriver()
        fetchWarehouses()
    }, [])

    useEffect(() => {
        if (selectedDeliveryAssignment) {
            fetchDelivery()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedDeliveryAssignment])

    useEffect(() => {
        if (drivers.length > 0) {
            if (currentDriver) {
                setCurrentDriver(drivers.find(driver => driver.id === currentDriver.id) || null)
            } else {
                setCurrentDriver(drivers[0])
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [drivers])

    useEffect(() => {
        if (currentDriver) {
            if (currentDriver.currentLatitude && currentDriver.currentLongitude) {
                setCenter({
                    lat: currentDriver.currentLatitude,
                    lng: currentDriver.currentLongitude
                })
            }
        }
    }, [currentDriver])

    return (
        <BaseLayout
            title='Driver'
            actions={
                <FlexLabelValue
                    label='Selected Driver'
                    value={
                        <FormSelect
                            options={drivers.map(driver => ({
                                label: driver.fullName,
                                value: driver.fullName
                            }))}
                            selected={currentDriver?.fullName}
                            onSelect={handleSelectDriver}
                        />
                    }
                />
            }
        >
            <div className='flex flex-col gap-4'>
                <DriverCard driver={currentDriver} />
                <DeliveryCard
                    driver={currentDriver}
                    onUpdate={handleUpdateDriver}
                    currentMarker={currentMarker}
                />
                <div className='flex gap-4'>
                    <div className='w-full flex flex-col gap-2'>
                        <DriverMap
                            center={center}
                            driver={currentDriver}
                            delivery={delivery}
                            warehouses={warehouses.filter(warehouse =>
                                selectedDeliveryAssignment?.warehouseIds.includes(warehouse.id)
                            )}
                            currentMarker={currentMarker}
                            onClickToMap={handleClickToMap}
                        />
                        <div className='flex justify-start gap-2'>
                            <Button
                                variant='default'
                                size='sm'
                                onClick={() => {
                                    if (
                                        currentDriver?.currentLatitude &&
                                        currentDriver?.currentLongitude
                                    ) {
                                        setCenter({
                                            lat: currentDriver?.currentLatitude,
                                            lng: currentDriver?.currentLongitude
                                        })
                                    }
                                }}
                            >
                                Current Location
                            </Button>
                            <Button
                                variant='default'
                                size='sm'
                                onClick={() => {
                                    if (
                                        delivery?.deliveryLocation.latitude &&
                                        delivery?.deliveryLocation.longitude
                                    ) {
                                        setCenter({
                                            lat: delivery?.deliveryLocation.latitude,
                                            lng: delivery?.deliveryLocation.longitude
                                        })
                                    }
                                }}
                            >
                                Customer Location
                            </Button>
                            <Button
                                variant='default'
                                size='sm'
                                onClick={() => {
                                    if (
                                        selectedDeliveryAssignment?.warehouseIds &&
                                        selectedDeliveryAssignment?.warehouseIds.length > 0
                                    ) {
                                        setCenter({
                                            lat:
                                                warehouses.find(warehouse =>
                                                    selectedDeliveryAssignment?.warehouseIds.includes(
                                                        warehouse.id
                                                    )
                                                )?.location.latitude || 0,
                                            lng:
                                                warehouses.find(warehouse =>
                                                    selectedDeliveryAssignment?.warehouseIds.includes(
                                                        warehouse.id
                                                    )
                                                )?.location.longitude || 0
                                        })
                                    }
                                }}
                            >
                                Warehouse Location
                            </Button>
                        </div>
                    </div>
                    {currentDriver && (
                        <DriverDeliveryAssignment
                            driver={currentDriver}
                            selectedDeliveryAssignment={selectedDeliveryAssignment}
                            onSelect={setSelectedDeliveryAssignment}
                            refetchDriver={fetchDriver}
                        />
                    )}
                </div>
            </div>
        </BaseLayout>
    )
}

export default DriverPage
