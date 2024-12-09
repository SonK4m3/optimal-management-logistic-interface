import FlexLabelValue from '@/components/FlexLabelValue'
import BaseLayout from '@/components/layout/BaseLayout'
import { Button } from '@/components/ui/button'
import RequestFactory from '@/services/RequestFactory'
import { Driver, WarehouseDriver } from '@/types/driver'
import { Delivery } from '@/types/order'
import { useCallback, useEffect } from 'react'
import { useState } from 'react'
import { useParams } from 'react-router-dom'
import OrderMap from '../../order/OrderMap'
import { Warehouse } from '@/types/warehouse'
import { useSelector } from 'react-redux'
import { RootState } from '@/store'
import { toast } from '@/components/ui/use-toast'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'

const DeliveryOrderPage = () => {
    const { orderId } = useParams()

    const user = useSelector((state: RootState) => state.user.user)
    const request = RequestFactory.getRequest('DeliveryRequest')
    const warehouseRequest = RequestFactory.getRequest('WarehouseRequest')
    const driverRequest = RequestFactory.getRequest('DriverRequest')

    const [delivery, setDelivery] = useState<Delivery>()
    const [availableDrivers, setAvailableDrivers] = useState<Driver[]>([])
    const [warehouses, setWarehouses] = useState<Warehouse[]>([])
    const [suggestedDrivers, setSuggestedDrivers] = useState<WarehouseDriver[] | null>(null)

    const [driverNumber, setDriverNumber] = useState<number>(1)

    const [vrp, setVrp] = useState<boolean>(false)

    const suggestDriver = async () => {
        if (!delivery) return

        setSuggestedDrivers(null)

        try {
            const res = vrp
                ? await request.suggestDriverVrp({
                    deliveryId: delivery?.id.toString() || '',
                    driverNumber,
                    driverIds: availableDrivers.map(driver => driver.id)
                })
                : await request.suggestDriver({
                    deliveryId: delivery?.id.toString() || '',
                    driverNumber,
                    driverIds: availableDrivers.map(driver => driver.id)
                })
            if (res.success) {
                setSuggestedDrivers(res.data.warehouseDrivers)
            }
        } catch (error) {
            console.log(error)
        }
    }

    const acceptSuggestedDriver = async () => {
        if (!suggestedDrivers) return

        try {
            const res = await driverRequest.assignDriverToDelivery({
                driverId: suggestedDrivers[0].driver.id.toString(),
                deliveryId: delivery?.id.toString() || '',
                warehouseIds: suggestedDrivers[0].warehouseIds
            })

            if (res.success) {
                toast({
                    title: 'Success',
                    description: 'Driver assigned successfully',
                    variant: 'success'
                })
            }
        } catch (error) {
            console.log(error)
            toast({
                title: 'Error',
                description: `${(error as Error).message}`,
                variant: 'destructive'
            })
        }
    }

    const findDriver = async () => {
        if (!delivery) return

        try {
            const res = await driverRequest.getAvailableDrivers(delivery.id.toString())
            if (res.success) {
                setAvailableDrivers(res.data)
            }
        } catch (error) {
            console.log(error)
        }
    }

    const fetchWarehouses = useCallback(async () => {
        if (!user?.id) return
        try {
            const response = await warehouseRequest.getWarehouses()
            if (response.success) {
                setWarehouses(response.data.docs)
            }
        } catch (error) {
            console.log(error)
        }
    }, [user?.id, warehouseRequest])

    useEffect(() => {
        if (orderId) {
            request.getDeliveryOrder(orderId).then(res => {
                setDelivery(res.data)
            })
        }
    }, [orderId, request])

    useEffect(() => {
        fetchWarehouses()
    }, [fetchWarehouses])

    return (
        <BaseLayout title='Delivery Order'>
            <div className='flex flex-col gap-4'>
                <div className='grid grid-cols-2 gap-4'>
                    <FlexLabelValue label='Order ID' value={delivery?.order.orderId} />
                    <FlexLabelValue label='Order Code' value={delivery?.order.orderCode} />
                    <FlexLabelValue label='Status' value={delivery?.status} />
                    <FlexLabelValue label='Priority' value={delivery?.order.priority} />
                    <FlexLabelValue label='Total Amount' value={delivery?.order.totalAmount} />
                    <FlexLabelValue label='Total Weight' value={delivery?.order.totalWeight} />
                    <FlexLabelValue label='Created At' value={delivery?.createdAt} />
                    <FlexLabelValue
                        label='Estimated Distance'
                        value={delivery?.estimatedDistance}
                    />
                    <FlexLabelValue
                        label='Estimated Delivery Time'
                        value={delivery?.estimatedDeliveryTime}
                    />
                    <FlexLabelValue label='Delivery Note' value={delivery?.deliveryNote} />
                </div>

                <div className='mt-4'>
                    <h3 className='font-semibold mb-2'>Pickup Location</h3>
                    <div className='grid grid-cols-2 gap-4'>
                        <FlexLabelValue
                            label='Address'
                            value={delivery?.deliveryLocation.address}
                        />
                    </div>
                </div>

                <div className='mt-4'>
                    <h3 className='font-semibold mb-2'>Customer Information</h3>
                    <div className='grid grid-cols-2 gap-4'>
                        <FlexLabelValue label='Name' value={delivery?.order.customer.fullName} />
                        <FlexLabelValue label='Email' value={delivery?.order.customer.email} />
                        <FlexLabelValue label='Phone' value={delivery?.order.customer.phone} />
                    </div>
                </div>

                {delivery?.driver && (
                    <div className='mt-4'>
                        <h3 className='font-semibold mb-2'>Driver Information</h3>
                        <div className='grid grid-cols-2 gap-4'>
                            <FlexLabelValue label='Name' value={delivery.driver.fullName} />
                            <FlexLabelValue label='Phone' value={delivery.driver.phone} />
                            <FlexLabelValue
                                label='License Number'
                                value={delivery.driver.licenseNumber}
                            />
                        </div>
                    </div>
                )}
            </div>

            <div className='mt-4 flex gap-4'>
                <div className='flex-1 flex flex-col gap-4'>
                    <div className='flex gap-4'>
                        <Button type='button' variant='primary' onClick={findDriver}>
                            Find Driver
                        </Button>
                        <FlexLabelValue label='Number of drivers' value={availableDrivers.length} />
                    </div>
                    <div className='flex gap-4'>
                        <Button type='button' variant='primary' onClick={suggestDriver}>
                            Suggest Driver
                        </Button>
                        <FlexLabelValue
                            label='VRP'
                            value={<Switch checked={vrp} onCheckedChange={setVrp} />}
                        />
                        <FlexLabelValue
                            label='Number of suggested drivers'
                            value={
                                <Input
                                    type='number'
                                    value={driverNumber}
                                    onChange={e => setDriverNumber(Number(e.target.value))}
                                />
                            }
                        />
                    </div>
                    {suggestedDrivers && suggestedDrivers.length > 0 && (
                        <div className='mt-4 flex flex-col gap-4'>
                            <h3 className='font-semibold mb-2'>Suggested Driver</h3>
                            {suggestedDrivers.map(wDriver => (
                                <div className='grid grid-cols-2 gap-4'>
                                    <FlexLabelValue label='Name' value={wDriver.driver.fullName} />
                                    <FlexLabelValue
                                        label='Warehouse'
                                        value={warehouses
                                            .filter(warehouse =>
                                                wDriver.warehouseIds.includes(warehouse.id)
                                            )
                                            .map(warehouse => warehouse.name)
                                            .join(', ')}
                                    />
                                </div>
                            ))}
                            <div className='flex gap-4'>
                                <Button
                                    type='button'
                                    variant='primary'
                                    onClick={acceptSuggestedDriver}
                                >
                                    Accept Suggested Driver
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
                {delivery && (
                    <div className='max-w-[50%] w-full'>
                        <h3 className='font-semibold mb-2'>Available Drivers</h3>
                        <OrderMap
                            center={{
                                latitude: delivery?.deliveryLocation?.latitude,
                                longitude: delivery?.deliveryLocation?.longitude
                            }}
                            key={delivery?.id}
                            order={{ ...delivery?.order, delivery: delivery }}
                            warehouses={warehouses.filter(warehouse =>
                                delivery?.warehouseList.includes(warehouse.id)
                            )}
                            drivers={availableDrivers}
                            highlight={{
                                warehouseIds: suggestedDrivers?.flatMap(
                                    wDriver => wDriver.warehouseIds
                                ),
                                driverIds: suggestedDrivers?.map(wDriver => wDriver.driver.id)
                            }}
                        />
                    </div>
                )}
            </div>
        </BaseLayout>
    )
}

export default DeliveryOrderPage
